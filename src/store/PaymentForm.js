import axios from 'axios';
import assert from 'assert';
import { find, includes } from 'lodash-es';
import getFunctionalUrls from '../getFunctionalUrls';
import { postMessage } from '../postMessage';
import PaymentConnection from './helpers/PaymentConnection';

const availableChannelStatuses = [
  'COMPLETED', 'DECLINED', 'CANCELLED',
];

const allowedPaymentStatuses = [
  // These ones are custom
  'NEW', 'CREATED', 'FAILED_TO_CREATE', 'PENDING', 'INTERRUPTED',
  // Those are from BE
  ...availableChannelStatuses,
];

const apiUrl = window.PAYSUPER_API_URL || 'https://p1payapi.tst.protocol.one';

function setPaymentStatus(commit, name) {
  commit('paymentStatus', name);
  postMessage(`PAYMENT_${name}`);
}

export default {
  namespaced: true,

  state: {
    apiUrl: '',
    orderID: '',
    token: '',
    account: '',
    project: null,
    initialEmail: '',
    paymentMethods: [],
    items: [],
    activePaymentMethodID: '',
    isLoading: false,
    isPaymentErrorVisible: false,
    paymentStatus: 'NEW',
    paymentResultMessage: '',
    isModal: false,
    testFinalSuccess: false,
  },

  getters: {
    urls(state) {
      return getFunctionalUrls(state.apiUrl);
    },
    activePaymentMethod(state) {
      return find(state.paymentMethods, { id: state.activePaymentMethodID });
    },
    hasPaymentRequestApi() {
      return Boolean(window.PaymentRequest);
    },
  },

  mutations: {
    apiUrl(state, value) {
      state.apiUrl = value;
    },
    orderID(state, value) {
      state.orderID = value;
    },
    token(state, value) {
      state.token = value;
    },
    account(state, value) {
      state.account = value;
    },
    project(state, value) {
      state.project = value;
    },
    initialEmail(state, value) {
      state.initialEmail = value;
    },
    paymentMethods(state, value) {
      state.paymentMethods = value;
    },
    items(state, value) {
      state.items = value;
    },
    activePaymentMethodID(state, value) {
      state.activePaymentMethodID = value;
    },
    isLoading(state, value) {
      state.isLoading = value;
    },
    isPaymentErrorVisible(state, value) {
      state.isPaymentErrorVisible = value;
    },
    paymentStatus(state, value) {
      assert(
        includes(allowedPaymentStatuses, value),
        `Payment status "${value}" is not allowed`,
      );
      state.paymentStatus = value;
    },
    paymentResultMessage(state, value) {
      state.paymentResultMessage = value;
    },
    isModal(state, value) {
      state.isModal = value;
    },
    testFinalSuccess(state, value) {
      state.testFinalSuccess = value;
    },
  },

  actions: {
    async initState({ commit }, { formData, options }) {
      commit('apiUrl', options.apiUrl || apiUrl);
      commit('initialEmail', options.email || '');
      commit('isModal', options.isModal || false);

      const orderData = formData.payment_form_data;

      commit('orderID', orderData.id);
      commit('token', orderData.token);
      commit('account', orderData.account);
      commit('project', orderData.project);
      commit('paymentMethods', orderData.payment_methods);
      commit('activePaymentMethodID', orderData.payment_methods[0].id);
      commit('items', orderData.items);
    },

    setActivePaymentMethod({ commit }, value) {
      commit('activePaymentMethodID', value);
    },

    hidePaymentError({ commit }) {
      commit('isPaymentErrorVisible', false);
    },

    async createPayment({ state, getters, commit }, {
      cardNumber, month, year, cvv, cardHolder, ewallet, email,
    }) {
      postMessage('PAYMENT_BEFORE_CREATED');
      commit('isLoading', true);

      const paymentConnection = new PaymentConnection(window, state.orderID, state.token);
      paymentConnection
        .init()
        .on('newPaymentStatus', (data) => {
          if (
            // Just in case. Its probably unnecessary
            data.order_id !== state.orderID
            || !includes(availableChannelStatuses, data.status)
          ) {
            return;
          }

          if (data.message) {
            commit('paymentResultMessage', data.message);
          }
          paymentConnection.closeRedirectWindow();
          setPaymentStatus(commit, data.status);
        })
        .on('redirectWindowClosedByUser', () => {
          setPaymentStatus(commit, 'INTERRUPTED');
        })
        .on('finalSuccess', () => {
          commit('testFinalSuccess', true);
        });

      const request = {
        email,
        month,
        year,
        cvv,
        card_holder: cardHolder,
        order_id: state.orderID,
        pan: cardNumber,
        payment_method_id: state.activePaymentMethodID,
      };
      if (getters.activePaymentMethod.type === 'crypto') {
        request.address = ewallet;
      } else {
        request.ewallet = ewallet;
      }

      try {
        const { data } = await axios.post(
          getters.urls.apiPathCreatePayment,
          request,
        );
        paymentConnection.setRedirectWindowLocation(data.redirect_url);
        postMessage('PAYMENT_CREATED', {
          redirectUrl: data.redirect_url,
        });
        setPaymentStatus(commit, 'PENDING');
      } catch (error) {
        paymentConnection.closeRedirectWindow();
        commit('isPaymentErrorVisible', true);
        setPaymentStatus(commit, 'FAILED_TO_CREATE');
      }
      commit('isLoading', false);
    },

    usePaymentApi({ dispatch }) {
      // Supported payment methods
      const supportedInstruments = [{
        supportedMethods: ['basic-card'],
        data: {
          supportedNetworks: [
            'visa', 'mastercard', 'amex', 'discover',
            'diners', 'jcb', 'unionpay',
          ],
        },
      }];

      // Checkout details
      const details = {
        displayItems: [
          {
            label: 'Original donation amount',
            amount: { currency: 'USD', value: '65.00' },
          }, {
            label: 'Friends and family discount',
            amount: { currency: 'USD', value: '-10.00' },
          },
        ],
        total: {
          label: 'Total due',
          amount: { currency: 'USD', value: '55.00' },
        },
      };

      const options = {
        requestPayerEmail: true,
      };

      // 1. Create a `PaymentRequest` instance
      const request = new PaymentRequest(supportedInstruments, details, options);

      // 2. Show the native UI with `.show()`
      request.show()
        .then(async (result) => {
          const data = {
            cardNumber: result.details.cardNumber,
            cardHolder: result.details.cardholderName,
            month: result.details.expiryMonth,
            year: result.details.expiryYear,
            cvv: result.details.cardSecurityCode,
            email: result.payerEmail,
          };
          result.complete('success');
          dispatch('createPayment', data);
        })
        .catch(() => {
          // user just closed the window
        });
    },
    finishPaymentCreation({ commit }) {
      setPaymentStatus(commit, 'PENDING');
    },
  },
};
