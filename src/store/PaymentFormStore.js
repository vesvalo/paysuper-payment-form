import axios from 'axios';
import assert from 'assert';
import {
  filter, find, findIndex, includes,
} from 'lodash-es';
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

function setPaymentStatus(commit, name) {
  commit('paymentStatus', name);
  postMessage(`PAYMENT_${name}`);
}

function setGeoData(commit, data) {
  if (data.user_ip_data) {
    commit('userCountry', data.user_ip_data.country);

    if (data.user_ip_data.city) {
      commit('userCity', data.user_ip_data.city);
    }
    if (data.user_ip_data.zip) {
      commit('userZip', data.user_ip_data.zip);
    }
  }
}

export default {
  namespaced: true,

  state: {
    orderId: '',
    orderData: null,
    activePaymentMethodId: '',
    isPaymentLoading: false,
    isFormLoading: false,
    actionResult: null,
    paymentStatus: 'NEW',
    isModal: false,
    testFinalSuccess: false,
    cards: [],
    isUserLocationCheckRequested: false,
    isUserLocationRestricted: false,
    userCountry: 'RU',
    userCity: '',
    userZip: '',
  },

  getters: {
    activePaymentMethod(state) {
      return find(state.orderData.payment_methods, { id: state.activePaymentMethodId });
    },
    hasPaymentRequestApi() {
      return Boolean(window.PaymentRequest);
    },
  },

  mutations: {
    cards(state, value) {
      state.cards = value;
    },
    orderId(state, value) {
      state.orderId = value;
    },
    orderData(state, value) {
      state.orderData = value;
    },
    activePaymentMethodId(state, value) {
      state.activePaymentMethodId = value;
    },
    isPaymentLoading(state, value) {
      state.isPaymentLoading = value;
    },
    isFormLoading(state, value) {
      state.isFormLoading = value;
    },
    actionResult(state, value) {
      state.actionResult = value;
    },
    paymentStatus(state, value) {
      assert(
        includes(allowedPaymentStatuses, value),
        `Payment status "${value}" is not allowed`,
      );
      state.paymentStatus = value;
    },
    isModal(state, value) {
      state.isModal = value;
    },
    testFinalSuccess(state, value) {
      state.testFinalSuccess = value;
    },
    isUserLocationCheckRequested(state, value) {
      state.isUserLocationCheckRequested = value;
    },
    isUserLocationRestricted(state, value) {
      state.isUserLocationRestricted = value;
    },
    userCountry(state, value) {
      state.userCountry = value;
    },
    userCity(state, value) {
      state.userCity = value;
    },
    userZip(state, value) {
      state.userZip = value;
    },
  },

  actions: {
    async initState({ commit }, { orderData, options }) {
      commit('isModal', options.isModal);

      commit('orderId', orderData.id);
      commit('orderData', orderData);

      const bankCardIndex = findIndex(orderData.payment_methods, { type: 'bank_card' });
      commit('activePaymentMethodId', orderData.payment_methods[bankCardIndex].id);

      setGeoData(commit, orderData);

      if (!orderData.country_payments_allowed) {
        if (orderData.country_change_allowed) {
          commit('isUserLocationCheckRequested', true);
        } else {
          commit('isUserLocationRestricted', true);
        }
      }

      if (localStorage) {
        const cards = localStorage.getItem('cards');

        try {
          commit('cards', JSON.parse(cards) || []);
        } catch (e) {
          commit('cards', []);
        }
      }
    },

    setActivePaymentMethodById({ commit }, value) {
      commit('activePaymentMethodId', value);
    },

    clearActionResult({ commit }) {
      commit('actionResult', null);
    },

    async createPayment({
      state, getters, rootState, commit,
    }, {
      cardNumber, expiryDate, cvv, cardHolder, ewallet, email, hasRemembered,
    }) {
      postMessage('PAYMENT_BEFORE_CREATED');

      if (hasRemembered) {
        const cards = [...state.cards, { cardNumber, expiryDate, cardHolder }];
        commit('cards', cards);
        localStorage.setItem('cards', JSON.stringify(cards));
      }

      const paymentConnection = new PaymentConnection(window, state.orderId, state.token);
      paymentConnection
        .init()
        .on('newPaymentStatus', (data) => {
          if (
            // Just in case. Its probably unnecessary
            data.order_id !== state.orderId
            || !includes(availableChannelStatuses, data.status)
          ) {
            return;
          }

          if (data.message) {
            commit('actionResult', {
              type: 'customError',
              message: data.message,
            });
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
        cvv,
        month: expiryDate.slice(0, 2),
        year: expiryDate.slice(2, 4),
        card_holder: cardHolder,
        order_id: state.orderId,
        pan: cardNumber,
        payment_method_id: state.activePaymentMethodId,
      };
      if (getters.activePaymentMethod.type === 'crypto') {
        request.address = ewallet;
      } else {
        request.ewallet = ewallet;
      }

      try {
        const { data } = await axios.post(
          `${rootState.apiUrl}/api/v1/payment`,
          request,
        );
        paymentConnection.setRedirectWindowLocation(data.redirect_url);
        postMessage('PAYMENT_CREATED', {
          redirectUrl: data.redirect_url,
        });
        setPaymentStatus(commit, 'PENDING');
      } catch (error) {
        paymentConnection.closeRedirectWindow();
        commit('actionResult', {
          type: 'customError',
          ...(error.response ? { message: error.response.data.message } : {}),
        });
        setPaymentStatus(commit, 'FAILED_TO_CREATE');
      }
    },
    finishPaymentCreation({ commit }) {
      setPaymentStatus(commit, 'PENDING');
    },
    removeCard({ commit, state }, cardNumber) {
      const cards = filter(state.cards, card => card.cardNumber !== cardNumber);
      commit('cards', cards);
      localStorage.setItem('cards', JSON.stringify(cards));
    },

    async checkPaymentAccount({
      state, rootState, commit,
    }, account) {
      const request = {
        method_id: state.activePaymentMethodId,
        account,
      };

      const response = await axios.patch(
        `${rootState.apiUrl}/api/v1/orders/${state.orderId}/customer`,
        request,
      );
      setGeoData(commit, response.data);
      if (response.data.user_address_data_required) {
        commit('isUserLocationCheckRequested', true);
      }
    },

    async checkUserLanguage({
      state, rootState, commit,
    }, lang) {
      const request = {
        lang,
      };

      try {
        const response = await axios.patch(
          `${rootState.apiUrl}/api/v1/orders/${state.orderId}/language`,
          request,
        );
        setGeoData(commit, response.data);
        if (response.data.user_address_data_required) {
          commit('isUserLocationCheckRequested', true);
        }
      } catch (error) {
        console.error(error);
      }
    },

    updateUserCountry({ commit }, userCountry) {
      commit('userCountry', userCountry);
    },

    setPaymentLoading({ commit }, value) {
      commit('isPaymentLoading', value);
    },

    setFormLoading({ commit }, value) {
      commit('isFormLoading', value);
    },

    async updateBillingData({ state, rootState }) {
      const request = {
        country: state.userCountry,
      };

      try {
        const response = await axios.post(
          `${rootState.apiUrl}/api/v1/orders/${state.orderId}/billing_address`,
          request,
        );
        console.log(11111, 'updateBillingData response', response);
      } catch (error) {
        console.error(error);
      }
    },

    async checkUserCountry({ state, commit, rootState }) {
      try {
        const response = await axios.get(`${rootState.apiUrl}/api/v1/country/${state.userCountry}`);
        if (!response.data.payments_allowed) {
          if (response.data.change_allowed) {
            commit('isUserLocationCheckRequested', true);
          } else {
            commit('isUserLocationRestricted', true);
          }
        }
        console.log(11111, 'checkUserCountry response', response);
      } catch (error) {
        console.error(error);
      }

      commit('isUserLocationCheckRequested', false);
    },
  },
};
