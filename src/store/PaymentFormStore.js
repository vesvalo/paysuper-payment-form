import axios from 'axios';
import assert from 'assert';
import {
  reject, find, findIndex, get, includes, pick,
} from 'lodash-es';
import { postMessage } from '../postMessage';
import PaymentConnection from '@/tools/PaymentConnection';
import useDelayedCallbackOnPromise from '@/helpers/useDelayedCallbackOnPromise';
import { gtagEvent, gtagSet, getEcommerceItems } from '@/analytics';

const allowedPaymentStatuses = [
  // These ones are custom
  'INITIAL', 'FAILED_TO_BEGIN', 'NEW', 'BEFORE_CREATED',
  'CREATED', 'FAILED_TO_CREATE', 'INTERRUPTED',
  'SYSTEM_SUCCESS', 'COMPLETED', 'DECLINED',
  'RECREATE_TO_BEGIN', 'RECREATE_TO_CONTINUE',
];

// See ActionResult.vue to understand how it looks
// "type" and "message" are its props
const actionResultsByStatus = {
  NEW: () => null,
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
  RECREATE_TO_CONTINUE: () => null,
};

const actionProcessingByStatus = {
  NEW: () => null,
  BEFORE_CREATED: () => ({ type: 'paymentLoading' }),
  SYSTEM_SUCCESS: () => ({ type: 'systemSuccess' }),
  FAILED_TO_CREATE: () => null,
  INTERRUPTED: () => null,
  COMPLETED: () => null,
  DECLINED: () => null,
  RECREATE_TO_CONTINUE: () => ({ type: 'simpleLoading' }),
};

export default {
  namespaced: true,

  state: {
    orderParams: {},
    orderData: {
      project: {
        name: '',
      },
    },
    activePaymentMethodId: '',
    currentPlatformId: '',
    actionProcessing: null,
    actionResult: null,
    paymentStatus: 'INITIAL',
    cards: [],
    isUserCountryConfirmRequested: false,
    isUserCountryRestricted: false,
    isEmailFieldExposed: true,
    isCountryFieldExposed: true,
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
      gtagEvent('showActionProcessing', value);
    },
    actionResult(state, value) {
      state.actionResult = value;
      gtagEvent('showActionResult', value);
    },
    paymentStatus(state, value) {
      assert(
        includes(allowedPaymentStatuses, value),
        `Payment status "${value}" is not allowed`,
      );
      state.paymentStatus = value;
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
    isCountryFieldExposed(state, value) {
      state.isCountryFieldExposed = value;
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
    initState({ state, commit, dispatch }, { orderParams, orderData }) {
      if (orderData.error) {
        dispatch('setPaymentStatus', [
          'FAILED_TO_BEGIN',
          orderData.error,
        ]);
        gtagEvent('orderPrimaryInitError', { error: orderData.error });
        return;
      }
      if (orderData.is_already_processed) {
        dispatch('setPaymentStatus', [
          'FAILED_TO_BEGIN',
          {
            type: 'alreadyProcessed',
            receiptUrl: orderData.receipt_url,
          },
        ]);
        gtagEvent('orderAlreadyProcessed');
        return;
      }
      assert(orderData, 'orderData is required to init PaymentFormStore');
      commit('orderData', orderData);
      if (orderParams) {
        commit('orderParams', orderParams);
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
      if (orderData.user_ip_data) {
        commit('userIpGeoData', orderData.user_ip_data);
      }
      dispatch('setGeoParams', orderData);
      dispatch('setPaymentStatus', ['NEW']);

      const items = getEcommerceItems(state.orderData);
      gtagEvent('begin_checkout', {
        items,
      });
    },

    setPaymentStatus({ commit }, [name, extraData]) {
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
    },

    setGeoParams({ commit }, data) {
      // Drop to defaults
      commit('isUserCountryConfirmRequested', false);

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
      state, rootState, dispatch,
    }, {
      cardNumber, expiryDate, cvv, ewallet, crypto, email, hasRemembered,
      country, city, zip, cardDataType, savedCardId,
    }) {
      dispatch('setPaymentStatus', ['BEFORE_CREATED']);

      const paymentConnection = new PaymentConnection(
        {
          window,
          orderId: state.orderData.id,
          token: state.orderData.token,
        },
      )
        .on('redirectWindowClosedByUser', () => {
          dispatch('setPaymentStatus', ['INTERRUPTED']);
        })
        .on('paymentDeclined', (data) => {
          dispatch('setPaymentStatus', ['DECLINED', data]);
        })
        .on('paymentFailed', (data) => {
          dispatch('setPaymentStatus', ['FAILED_TO_CREATE', data]);
        })
        .on('paymentSystemSuccess', () => {
          dispatch('setPaymentStatus', ['SYSTEM_SUCCESS']);
        })
        .on('paymentCompleted', () => {
          dispatch('setPaymentStatus', ['COMPLETED']);

          const items = getEcommerceItems(state.orderData);
          gtagEvent('purchase', {
            transaction_id: state.orderData.id,
            currency: state.orderData.currency,
            tax: state.orderData.vat,
            items,
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
            dispatch('setPaymentStatus', ['CREATED']);
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

        dispatch('setPaymentStatus', [
          'FAILED_TO_CREATE',
          errorData || undefined,
        ]);
      }
    },

    setActionResult({ commit }, value) {
      commit('actionResult', value);
    },
    setActionProcessing({ commit }, value) {
      commit('actionProcessing', value);
    },

    async removeCard({ commit, state, rootState }, id) {
      try {
        await axios.delete(
          `${rootState.apiUrl}/api/v1/saved_card`,
          {
            data: { id },
            withCredentials: true,
          },
        );
        const cards = reject(state.cards, { id });
        commit('cards', cards);
      } catch (error) {
        console.error(error);
      }
      gtagEvent('removeRememberedCard', { event_category: 'userAction' });
    },

    async checkPaymentAccount({
      state, rootState, dispatch,
    }, account) {
      const request = {
        method_id: state.activePaymentMethodId,
        account,
      };

      gtagEvent('checkPaymentAccount');
      const response = await axios.patch(
        `${rootState.apiUrl}/api/v1/orders/${state.orderData.id}/customer`,
        request,
      );
      dispatch('setOrderDataBillingParams', response.data);
      dispatch('setGeoParams', response.data);
    },

    async checkUserLanguage({
      state, rootState, dispatch,
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
        dispatch('setGeoParams', response.data);
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
    async updateBillingData({
      state, commit, dispatch, rootState,
    }, { country, zip }) {
      const request = {
        country,
        ...(zip ? { zip } : {}),
      };

      try {
        const response = await axios.post(
          `${rootState.apiUrl}/api/v1/orders/${state.orderData.id}/billing_address`,
          request,
        );

        dispatch('setOrderDataBillingParams', response.data);
        commit('isZipInvalid', false);
        if (!response.data.country_change_allowed) {
          commit('isCountryFieldExposed', false);
        }
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
          if (apiErrorCode) {
            commit('actionResult', {
              type: 'customError',
              code: apiErrorCode,
            });
          }
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

    setOrderDataBillingParams({ state, commit }, data) {
      const pickedProps = pick(data, [
        'amount',
        'charge_amount',
        'charge_currency',
        'currency',
        'has_vat',
        'items',
        'total_amount',
        'vat',
        'vat_in_charge_currency',
        'vat_rate',
      ]);

      commit('orderData', {
        ...state.orderData,
        ...pickedProps,
      });
    },
  },
};
