import axios from 'axios';
import assert from 'assert';
import {
  filter, find, findIndex, get, includes,
} from 'lodash-es';
import { postMessage } from '../postMessage';
import PaymentConnection from '@/tools/PaymentConnection';
import useDelayedCallbackOnPromise from '@/helpers/useDelayedCallbackOnPromise';
import i18n from '@/i18n';
import { gtagEvent, gtagSet } from '@/analytics';

function getErrorCodeTranslation(code) {
  const noTranslationMessage = 'Unknown error';
  if (!code) {
    return noTranslationMessage;
  }
  return get(i18n.messages[i18n.locale], `errorCodes.${code}`)
    || get(i18n.messages[i18n.locale], `errorCodes.${code.slice(0, 2)}*`)
    || noTranslationMessage;
}

const availableChannelStatuses = [
  'COMPLETED', 'DECLINED',
];

const allowedPaymentStatuses = [
  // These ones are custom
  'INITIAL', 'FAILED_TO_BEGIN', 'NEW', 'BEFORE_CREATED',
  'CREATED', 'FAILED_TO_CREATE', 'INTERRUPTED',
  'PROBABLY_COMPLETED',
  // Those are from BE
  ...availableChannelStatuses,
];

// See ActionResult.vue to understand how it looks
// "type" and "message" are its props
const actionResultsByStatus = {
  FAILED_TO_BEGIN(data) {
    if (data) {
      return {
        type: 'customError',
        message: getErrorCodeTranslation(data.code),
      };
    }
    return { type: 'unknownError' };
  },
  COMPLETED: () => ({ type: 'success' }),
  DECLINED(data) {
    return {
      type: 'customError',
      message: getErrorCodeTranslation(data.decline.code),
    };
  },
  INTERRUPTED: () => ({ type: 'customError', message: i18n.t('errorCodes.redirectWindowClosed') }),
  FAILED_TO_CREATE(data) {
    if (data) {
      if (data.code === 'fm000025') {
        return { type: 'unknownError' };
      }
      return {
        type: 'customError',
        message: getErrorCodeTranslation(data.code),
      };
    }
    return { type: 'unknownError' };
  },
};

const actionProcessingByStatus = {
  BEFORE_CREATED: () => ({ type: '3d-security' }),
  PROBABLY_COMPLETED: () => ({ type: 'no-content' }),
  FAILED_TO_CREATE: () => null,
  INTERRUPTED: () => null,
  COMPLETED: () => null,
  DECLINED: () => null,
};

function setPaymentStatus(commit, name, extraData) {
  gtagEvent('changePaymentStatus', { event_label: name });
  commit('paymentStatus', name);
  postMessage(`PAYMENT_${name}`);

  const actionResult = actionResultsByStatus[name];
  if (actionResult) {
    commit('actionResult', actionResult(extraData));
  }

  const actionProcessing = actionProcessingByStatus[name];
  if (actionProcessing) {
    commit('actionProcessing', actionProcessing(extraData));
  }
}

function setGeoParams(commit, data) {
  // Drop to defaults
  commit('isUserCountryConfirmRequested', false);

  if (data.user_ip_data) {
    commit('userIpGeoData', data.user_ip_data);
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
    orderParams: null,
    orderData: null,
    activePaymentMethodId: '',
    currentPlatformId: '',
    actionProcessing: null,
    actionResult: null,
    paymentStatus: 'INITIAL',
    options: false,
    cards: [],
    isUserCountryConfirmRequested: false,
    isUserCountryRestricted: false,
    isGeoFieldsExposed: false,
    userIpGeoData: null,
    isZipInvalid: false,
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
    orderParams(state, value) {
      state.orderParams = value;
    },
    orderData(state, value) {
      state.orderData = value;
    },
    currentPlatformId(state, value) {
      state.currentPlatformId = value;
    },
    activePaymentMethodId(state, value) {
      state.activePaymentMethodId = value;
    },
    actionProcessing(state, value) {
      state.actionProcessing = value;
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
    isUserCountryConfirmRequested(state, value) {
      state.isUserCountryConfirmRequested = value;
    },
    isUserCountryRestricted(state, value) {
      state.isUserCountryRestricted = value;
    },
    isGeoFieldsExposed(state, value) {
      state.isGeoFieldsExposed = value;
    },
    userIpGeoData(state, value) {
      state.userIpGeoData = value;
    },
    isZipInvalid(state, value) {
      state.isZipInvalid = value;
    },
  },

  actions: {
    async initState({ commit }, { orderParams, orderData, options }) {
      commit('options', options);
      commit('orderParams', orderParams);
      // orderData.payment_methods[bankCardIndex].saved_cards = [
      //   {
      //     id: 23123,
      //     pan: '3000000000434342',
      //     expire: {
      //       month: '01',
      //       year: '22',
      //     },
      //   },
      // ];
      // commit('cards', orderData.payment_methods[bankCardIndex].saved_cards);
      commit('orderData', orderData);
      if (orderData.error) {
        setPaymentStatus(
          commit, 'FAILED_TO_BEGIN',
          orderData.error,
        );
        return;
      }

      const bankCardIndex = findIndex(orderData.payment_methods, { type: 'bank_card' });
      if (orderData.platforms) {
        commit('currentPlatformId', orderData.platforms[0].id);
      }
      commit('activePaymentMethodId', orderData.payment_methods[bankCardIndex].id);

      setGeoParams(commit, orderData);
      setPaymentStatus(commit, 'NEW');

      const items = (get(orderData, 'items') || []).map((item, index) => ({
        id: item.id,
        name: item.name,
        list_name: 'Cart items',
        list_position: index + 1,
        price: `${item.amount}`,
        quantity: 1,
      }));

      gtagEvent('begin_checkout', {
        items: items.length
          ? items
          : [{
            id: orderParams.project,
            name: 'Virtual Currency',
            price: `${orderData.amount}`,
            quantity: 1,
          }],
      });
    },

    setActivePaymentMethodById({ commit }, value) {
      commit('activePaymentMethodId', value);
      gtagSet({ paymentMethodId: value });
      gtagEvent('setPaymentMethod', {
        event_category: 'userAction',
        paymentMethodId: value,
      });
    },

    clearActionResult({ commit }) {
      commit('actionResult', null);
    },

    async createPayment({
      state, rootState, commit,
    }, {
      cardNumber, expiryDate, cvv, ewallet, crypto, email, hasRemembered,
      country, city, zip,
    }) {
      setPaymentStatus(commit, 'BEFORE_CREATED');

      const paymentConnection = new PaymentConnection(
        {
          window,
          orderId: state.orderData.id,
          token: state.orderData.token,
          options: state.options,
        },
      )
        .init()
        .on('newPaymentStatus', (data) => {
          if (
            // Just in case. Its probably unnecessary
            data.order_id !== state.orderData.id
            || !includes(availableChannelStatuses, data.status)
          ) {
            return;
          }
          paymentConnection.closeRedirectWindow();
          setPaymentStatus(commit, data.status, data);

          if (data.status === 'COMPLETED') {
            const items = (get(state.orderData, 'items') || []).map((item, index) => ({
              id: item.id,
              name: item.name,
              price: item.amount,
              list_position: `${index + 1}`,
              quantity: 1,
            }));

            gtagEvent('purchase', {
              transaction_id: state.orderData.id,
              currency: state.orderData.currency,
              tax: state.orderData.vat,
              items: items.length
                ? items
                : [{
                  id: state.orderParams.project,
                  name: 'Virtual Currency',
                  price: `${state.orderData.amount}`,
                  quantity: 1,
                }],
            });
          }
        })
        .on('redirectWindowClosedByUser', () => {
          setPaymentStatus(commit, 'INTERRUPTED');
        })
        .on('reportSuccess', () => {
          setPaymentStatus(commit, 'PROBABLY_COMPLETED');
        })
        .on('reportFail', () => {
          setPaymentStatus(commit, 'FAILED_TO_CREATE');
        });

      const request = {
        email,
        cvv,
        month: expiryDate.slice(0, 2),
        year: expiryDate.slice(2, 4),
        // https://protocolone.tpondemand.com/restui/board.aspx?#page=userstory/192384
        card_holder: 'Cardholder',
        order_id: state.orderData.id,
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
      };

      try {
        // Delay is used for the redirect window not to open too soon
        await useDelayedCallbackOnPromise(
          axios.post(
            `${rootState.apiUrl}/api/v1/payment`,
            request,
          ),
          ({ data }) => {
            paymentConnection.setRedirectWindowLocation(data.redirect_url);
            setPaymentStatus(commit, 'CREATED');
          },
          2000,
        );
      } catch (error) {
        paymentConnection.closeRedirectWindow();

        const errorData = get(error, 'response.data') || {};

        gtagEvent('purchaseFailed', {
          errorCode: errorData.code || undefined,
          errorMessage: errorData.message || undefined,
        });

        setPaymentStatus(
          commit, 'FAILED_TO_CREATE',
          errorData || undefined,
        );
      }
    },
    removeCard({ commit, state }, cardNumber) {
      const cards = filter(state.cards, card => card.cardNumber !== cardNumber);
      commit('cards', cards);
      localStorage.setItem('cards', JSON.stringify(cards));

      gtagEvent('removeRememberedCard', { event_category: 'userAction' });
    },

    async checkPaymentAccount({
      state, rootState, commit,
    }, account) {
      const request = {
        method_id: state.activePaymentMethodId,
        account,
      };

      const response = await axios.patch(
        `${rootState.apiUrl}/api/v1/orders/${state.orderData.id}/customer`,
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
          `${rootState.apiUrl}/api/v1/orders/${state.orderData.id}/language`,
          request,
        );
        setGeoParams(commit, response.data);
      } catch (error) {
        console.error(error);
      }
    },

    submitUserCountry({ commit }) {
      commit('isUserCountryConfirmRequested', false);
    },

    /**
     * Used when geo data changes (country/city/zip)
     */
    async updateBillingData({ state, commit, rootState }, { country, city, zip }) {
      if (country === 'US' && (!city || !zip)) {
        return;
      }
      const request = {
        country,
        ...(city ? { city } : {}),
        ...(zip ? { zip } : {}),
      };

      try {
        const response = await axios.post(
          `${rootState.apiUrl}/api/v1/orders/${state.orderData.id}/billing_address`,
          request,
        );

        commit('orderData', {
          ...state.orderData,
          ...response.data,
        });

        commit('isZipInvalid', false);
      } catch (error) {
        const zipErrors = [
          'fm000050', // zip not found
          'ma000073', // zip invalid
        ];
        const apiErrorCode = get(error, 'response.data.code');
        if (includes(zipErrors, apiErrorCode)) {
          commit('isZipInvalid', true);
        } else {
          console.error(error);
        }
      }
    },

    async changePlatform({ state, commit, rootState }, platform) {
      try {
        await axios.post(
          `${rootState.apiUrl}/api/v1/orders/${state.orderData.id}/platform`,
          {
            platform,
          },
        );
        commit('currentPlatformId', platform);
      } catch (error) {
        console.error(error);
      }
    },

    tryToBeginAgain() {
      postMessage('TRY_TO_BEGIN_AGAIN');
      window.location.reload();
    },
  },
};
