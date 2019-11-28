import axios from 'axios';
import assert from 'assert';
import qs from 'qs';
import {
  reject, find, findIndex, get, includes,
} from 'lodash-es';
import { postMessage } from '../postMessage';
import PaymentConnection from '@/tools/PaymentConnection';
import useDelayedCallbackOnPromise from '@/helpers/useDelayedCallbackOnPromise';
import { gtagEvent, gtagSet } from '@/analytics';


const allowedPaymentStatuses = [
  // These ones are custom
  'INITIAL', 'FAILED_TO_BEGIN', 'NEW', 'BEFORE_CREATED',
  'CREATED', 'FAILED_TO_CREATE', 'INTERRUPTED',
  'SYSTEM_SUCCESS', 'COMPLETED', 'DECLINED',
];

// See ActionResult.vue to understand how it looks
// "type" and "message" are its props
const actionResultsByStatus = {
  FAILED_TO_BEGIN(data) {
    if (data) {
      return {
        type: 'customError',
        code: '',
        ...data,
      };
    }
    return { type: 'unknownError' };
  },
  COMPLETED: () => ({ type: 'success' }),
  DECLINED(data) {
    return {
      type: 'customError',
      code: data.code,
    };
  },
  INTERRUPTED: () => ({ type: 'customError', code: 'redirectWindowClosed' }),
  FAILED_TO_CREATE(data) {
    if (data) {
      if (data.code === 'fm000025') {
        return { type: 'unknownError' };
      }
      return {
        type: 'customError',
        code: data.code,
      };
    }
    return { type: 'unknownError' };
  },
};

const actionProcessingByStatus = {
  BEFORE_CREATED: () => ({ type: 'simpleLoading' }),
  SYSTEM_SUCCESS: () => ({ type: 'systemSuccess' }),
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
    commit('actionResult', actionResult({ code: 'fm000016' }));
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
    isEmailFieldExposed: true,
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
      // Example
      // {
      //   id: '5dbf183234a8da000131affc',
      //   pan: '400000...0002',
      //   card_holder: 'CARDHOLDER'
      //   expire: {
      //     month: '01',
      //     year: '22',
      //   },
      // },
      state.cards = value || [];
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
    isEmailFieldExposed(state, value) {
      state.isEmailFieldExposed = value;
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
      commit('orderData', orderData);
      if (orderData.error) {
        setPaymentStatus(
          commit, 'FAILED_TO_BEGIN',
          orderData.error,
        );
        return;
      }
      if (orderData.is_already_processed) {
        setPaymentStatus(
          commit, 'FAILED_TO_BEGIN',
          {
            type: 'alreadyProcessed',
            receiptUrl: orderData.receipt_url,
          },
        );
        return;
      }

      const bankCardIndex = findIndex(orderData.payment_methods, { type: 'bank_card' });
      const bankCardMethod = orderData.payment_methods[bankCardIndex];
      commit('activePaymentMethodId', bankCardMethod.id);
      commit('cards', bankCardMethod.saved_cards);

      if (orderData.platforms) {
        commit('currentPlatformId', orderData.platforms[0].id);
      }
      if (orderData.email) {
        commit('isEmailFieldExposed', false);
      }

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

    async createPayment({
      state, rootState, commit,
    }, {
      cardNumber, expiryDate, cvv, ewallet, crypto, email, hasRemembered,
      country, city, zip, cardDataType, savedCardId,
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
        .on('redirectWindowClosedByUser', () => {
          setPaymentStatus(commit, 'INTERRUPTED');
        })
        .on('paymentDeclined', (data) => {
          setPaymentStatus(commit, 'DECLINED', data);
        })
        .on('paymentFailed', (data) => {
          setPaymentStatus(commit, 'FAILED_TO_CREATE', data);
        })
        .on('paymentSystemSuccess', () => {
          setPaymentStatus(commit, 'SYSTEM_SUCCESS');
        })
        .on('paymentCompleted', () => {
          setPaymentStatus(commit, 'COMPLETED');

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
        });

      const month = expiryDate.slice(0, 2);
      const year = expiryDate.slice(2, 4);
      const request = {
        email,
        ...(
          cardDataType === 'saved'
            ? { stored_card_id: savedCardId }
            : {
              // https://protocolone.tpondemand.com/restui/board.aspx?#page=userstory/192384
              cvv, month, year, pan: cardNumber, card_holder: 'Cardholder',
            }
        ),
        order_id: state.orderData.id,
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
            setPaymentStatus(commit, 'CREATED');
            if (data.need_redirect) {
              paymentConnection.setRedirectWindowLocation(data.redirect_url);
            } else {
              paymentConnection.reportSystemSuccess().closeRedirectWindow();
            }
          },
          2000,
        );
      } catch (error) {
        paymentConnection.closeRedirectWindow().disconnect();

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
    async removeCard({ commit, state }, id) {
      try {
        await axios.post(
          '/order/remove_saved_card',
          { id },
        );
        const cards = reject(state.cards, { id });
        commit('cards', cards);
      } catch (error) {
        console.error(error);
      }
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
    async updateBillingData({ state, commit, rootState }, { country, zip }) {
      if (country === 'US' && !zip) {
        return;
      }
      const request = {
        country,
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

    async recreateOrder({ state, rootState }) {
      gtagEvent('clickTryAgainButton', { event_category: 'userAction' });
      let location = window.location.href;

      if (!state.orderParams.project) {
        try {
          const { data } = await axios.post(
            `${rootState.apiUrl}/api/v1/order/recreate`,
            {
              order_id: state.orderData.id,
            },
          );

          const [host] = window.location.href.split('?');
          const queryString = qs.stringify({
            order_id: data.id,
            ...state.orderParams,
          });

          location = `${host}?${queryString}`;
        } catch (error) {
          console.error(error);
        }
      }
      postMessage('TRY_TO_BEGIN_AGAIN');
      window.location.replace(location);
    },
  },
};
