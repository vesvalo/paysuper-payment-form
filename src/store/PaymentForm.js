import axios from 'axios';
import Centrifuge from 'centrifuge';
import assert from 'assert';
import { find, includes } from 'lodash-es';
import getFunctionalUrls from '../getFunctionalUrls';
import { postMessage } from '../postMessage';

const availableChannelStatuses = [
  'COMPLETED', 'DECLINED', 'CANCELLED',
];

const allowedPaymentStatuses = [
  // These ones are custom
  'NEW', 'CREATED', 'FAILED_TO_CREATE', 'PENDING', 'INTERRUPTED',
  // Those are from BE
  ...availableChannelStatuses,
];

const apiUrl = window.P1PAYONE_API_URL || 'https://p1payapi.tst.protocol.one';

const websocketServerUrl = window.P1PAYONE_WEBSOCKET_URL
  || 'wss://cf.tst.protocol.one/connection/websocket';

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
    activePaymentMethodID: '',
    isLoading: false,
    isPaymentErrorVisible: false,
    paymentStatus: 'NEW',
    paymentResultMessage: '',
    isModal: false,
  },

  getters: {
    urls(state) {
      return getFunctionalUrls(state.apiUrl);
    },
    activePaymentMethod(state) {
      return find(state.paymentMethods, { id: state.activePaymentMethodID });
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
  },

  actions: {
    async initState({ commit }, { formData, options }) {
      commit('apiUrl', options.apiUrl || apiUrl);
      commit('initialEmail', options.email || '');
      commit('isModal', options.isModal || false);

      commit('orderID', formData.id);
      commit('token', formData.token);
      commit('account', formData.account);
      commit('project', formData.project);
      commit('paymentMethods', formData.payment_methods);
      commit('activePaymentMethodID', formData.payment_methods[0].id);
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

      const centrifuge = new Centrifuge(websocketServerUrl);
      centrifuge.setToken(state.token);

      const windowForRedirect = window.open('', '_blank');
      /**
       * We're watching for tab to be closed
       * If so we show an error
       */
      const windowForRedirectClosedInterval = setInterval(() => {
        if (windowForRedirect.closed) {
          centrifuge.disconnect();
          clearInterval(windowForRedirectClosedInterval);
          setPaymentStatus(commit, 'INTERRUPTED');
        }
      }, 2000);

      centrifuge.subscribe(`payment:notify#${state.orderID}`, ({ data }) => {
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
        setPaymentStatus(commit, data.status);
        windowForRedirect.close();
        clearInterval(windowForRedirectClosedInterval);
        centrifuge.disconnect();
      });
      centrifuge.connect();

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
        postMessage('PAYMENT_CREATED', {
          redirectUrl: data.redirect_url,
        });
        windowForRedirect.location = data.redirect_url;
        setPaymentStatus(commit, 'PENDING');
      } catch (error) {
        windowForRedirect.close();
        commit('isPaymentErrorVisible', true);
        setPaymentStatus(commit, 'FAILED_TO_CREATE');
      }
      commit('isLoading', false);
    },

    finishPaymentCreation({ commit }) {
      setPaymentStatus(commit, 'PENDING');
    },
  },
};
