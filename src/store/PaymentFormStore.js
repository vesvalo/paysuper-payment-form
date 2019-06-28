import axios from 'axios';
import assert from 'assert';
import {
  filter, find, findIndex, includes,
} from 'lodash-es';
import { postMessage } from '../postMessage';
import PaymentConnection from '@/tools/PaymentConnection';
import i18n from '@/i18n';

const availableChannelStatuses = [
  'COMPLETED', 'DECLINED', 'CANCELLED',
];

const allowedPaymentStatuses = [
  // These ones are custom
  'NEW', 'BEFORE_CREATED', 'CREATED', 'FAILED_TO_CREATE', 'INTERRUPTED',
  // Those are from BE
  ...availableChannelStatuses,
];

const actionResultsByStatus = {
  COMPLETED: () => ({ type: 'success' }),
  DECLINED(data) {
    return {
      type: 'customError',
      message: i18n.t(`errorCodes.${data.decline.code}`),
    };
  },
  // CANCELLED: () => ({ type: 'unknownError' }),
  INTERRUPTED: () => ({ type: 'customError', message: i18n.t('errorCodes.redirectWindowClosed') }),
  FAILED_TO_CREATE(data) {
    console.log(11111, 'FAILED_TO_CREATE', data);
    if (data) {
      if (data.code === 'fm000025') {
        return { type: 'unknownError' };
      }
      return {
        type: 'customError',
        message: i18n.t(`errorCodes.${data.code}`),
      };
    }
    return { type: 'unknownError' };
  },
};

function setPaymentStatus(commit, name, extraData) {
  commit('paymentStatus', name);
  postMessage(`PAYMENT_${name}`);

  const actionResult = actionResultsByStatus[name];
  if (actionResult) {
    commit('actionResult', actionResult(extraData));
  }

  if (name === 'BEFORE_CREATED') {
    commit('isPaymentLoading', true);
  }

  if (includes(['FAILED_TO_CREATE', 'INTERRUPTED', 'COMPLETED', 'DECLINED', 'CANCELLED'], name)) {
    commit('isPaymentLoading', false);
  }
}

function setGeoParams(commit, data) {
  if (data.user_ip_data) {
    commit('userCountry', data.user_ip_data.country);

    if (data.user_ip_data.city) {
      commit('userCity', data.user_ip_data.city);
    }
    if (data.user_ip_data.zip) {
      commit('userZip', data.user_ip_data.zip);
    }
  }

  if (data.country_payments_allowed === false) {
    commit('isGeoFieldsExposed', true);
    if (data.country_change_allowed) {
      commit('isUserCountryConfirmRequested', true);
    } else {
      commit('isUserCountryRestricted', true);
    }
  }

  if (data.user_address_data_required) {
    commit('isGeoFieldsExposed', true);
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
    options: false,
    testFinalSuccess: false,
    cards: [],
    isUserCountryConfirmRequested: false,
    isUserCountryRestricted: false,
    isGeoFieldsExposed: false,
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
    options(state, value) {
      state.options = value;
    },
    testFinalSuccess(state, value) {
      state.testFinalSuccess = value;
    },
    isUserCountryConfirmRequested(state, value) {
      state.isUserCountryConfirmRequested = value;
    },
    isUserCountryRestricted(state, value) {
      state.isUserCountryRestricted = value;
    },
    isGeoFieldsExposed(state, value) {
      state.isGeoFieldsExposed = value;
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
    async initState({ commit, dispatch }, { orderParams, options }) {
      commit('options', options);

      await dispatch('createOrder', orderParams);

      // if (localStorage) {
      //   const cards = localStorage.getItem('cards');

      //   try {
      //     commit('cards', JSON.parse(cards) || []);
      //   } catch (e) {
      //     commit('cards', []);
      //   }
      // }
    },

    async createOrder({ commit, rootState }, {
      project, token, products, amount, currency,
    }) {
      if (amount) {
        assert(currency, 'PaySuper: currency is not set');
      }
      try {
        const { data } = await axios.post(
          `${rootState.apiUrl}/api/v1/order`,
          {
            project,
            ...(token ? { token } : {}),
            ...(products ? { products } : {}),
            ...(amount ? { amount, currency } : {}),
          },
        );
        const orderData = data.payment_form_data;

        commit('orderId', orderData.id);
        commit('orderData', orderData);

        const bankCardIndex = findIndex(orderData.payment_methods, { type: 'bank_card' });
        commit('activePaymentMethodId', orderData.payment_methods[bankCardIndex].id);

        setGeoParams(commit, orderData);
      } catch (error) {
        console.error(error);
      }
    },

    setActivePaymentMethodById({ commit }, value) {
      commit('activePaymentMethodId', value);
    },

    clearActionResult({ commit }) {
      commit('actionResult', null);
    },

    async createPayment({
      state, rootState, commit,
    }, {
      cardNumber, expiryDate, cvv, cardHolder, ewallet, crypto, email, hasRemembered,
      country, city, zip,
    }) {
      setPaymentStatus(commit, 'BEFORE_CREATED');

      // if (hasRemembered) {
      //   const cards = [...state.cards, { cardNumber, expiryDate, cardHolder }];
      //   commit('cards', cards);
      //   localStorage.setItem('cards', JSON.stringify(cards));
      // }

      const paymentConnection = new PaymentConnection(
        {
          window,
          orderId: state.orderId,
          token: state.orderData.token,
          options: state.options,
        },
      )
        .init()
        .on('newPaymentStatus', (data) => {
          console.log(11111, 'newPaymentStatus', data);
          if (
            // Just in case. Its probably unnecessary
            data.order_id !== state.orderId
            || !includes(availableChannelStatuses, data.status)
          ) {
            return;
          }
          paymentConnection.closeRedirectWindow();
          setPaymentStatus(commit, data.status, data);
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
        store_data: hasRemembered,
        ewallet,
        address: crypto,
        ...(
          state.isGeoFieldsExposed
            ? {
              country,
              city,
              zip,
            }
            : {}
        ),
        country: 'RU',
        city: 'Краснодар',
        zip: '350028',
      };

      let redirectUrl = '';
      let delayHasPassed = false;
      setTimeout(() => {
        if (redirectUrl) {
          paymentConnection.setRedirectWindowLocation(redirectUrl);
        }
        delayHasPassed = true;
      }, 2000);

      try {
        const { data } = await axios.post(
          `${rootState.apiUrl}/api/v1/payment`,
          request,
        );
        redirectUrl = data.redirect_url;
        if (delayHasPassed) {
          paymentConnection.setRedirectWindowLocation(redirectUrl);
        }
        setPaymentStatus(commit, 'CREATED', {
          redirectUrl: data.redirect_url,
        });
      } catch (error) {
        paymentConnection.closeRedirectWindow();
        setPaymentStatus(
          commit, 'FAILED_TO_CREATE',
          (error.response ? error.response.data : undefined),
        );
      }
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
      setGeoParams(commit, response.data);
    },

    async checkUserLanguage({
      state, rootState, commit,
    }, locale) {
      const [lang] = locale.split('-');
      const request = {
        lang,
      };

      try {
        const response = await axios.patch(
          `${rootState.apiUrl}/api/v1/orders/${state.orderId}/language`,
          request,
        );
        setGeoParams(commit, response.data);
      } catch (error) {
        console.error(error);
      }
    },

    updateUserCountry({ commit }, userCountry) {
      commit('userCountry', userCountry);
      commit('isUserCountryConfirmRequested', false);
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
  },
};
