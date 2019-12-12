import Vue from 'vue';
import Vuex from 'vuex';
import qs from 'qs';
import axios from 'axios';
import assert from 'assert';
import { get } from 'lodash-es';
import { gtagEvent, gtagSet } from '@/analytics';
import localesScheme from '@/locales/scheme';
import getLanguage from '@/helpers/getLanguage';
import DictionariesStore from './DictionariesStore';
import PaymentFormStore from './PaymentFormStore';
import { postMessage } from '../postMessage';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiUrl: '',
    initialLocale: '',
    orderId: '',
    query: {},
    options: {},
    lastSize: {
      width: 0,
      height: 0,
    },
  },
  mutations: {
    apiUrl(state, value) {
      state.apiUrl = value;
    },
    initialLocale(state, value) {
      state.initialLocale = value;
    },
    orderId(state, value) {
      state.orderId = value;
    },
    query(state, value) {
      state.query = value;
    },
    lastSize(state, value) {
      state.lastSize = value;
    },
    options(state, value) {
      state.options = value;
    },
  },
  actions: {
    async initState({ commit, dispatch }, { orderParams, options, query }) {
      commit('options', options);
      commit('apiUrl', options.apiUrl);
      commit('query', query);
      dispatch('setInitialLocale');

      if (options.layout === 'loading') {
        return;
      }

      const orderData = await dispatch('getPreparedOrderData', {
        orderParams,
        queryOrderId: query.order_id,
      });
      gtagSet({ currency: orderData.currency });
      if (orderData.lang) {
        dispatch('setInitialLocale', orderData.lang);
        gtagEvent('customLocale', { locale: orderData.lang });
      }
      dispatch('PaymentForm/initState', { orderParams, orderData, options });
    },

    async getPreparedOrderData({ commit, dispatch }, { orderParams, queryOrderId }) {
      assert(
        orderParams || queryOrderId,
        'orderParams or queryOrderId is required to dispatch getPreparedOrderData',
      );
      let orderData;
      let orderId;
      try {
        orderId = queryOrderId || await dispatch('getOrderId', orderParams);
        orderData = await dispatch('getOrderData', orderId);
        commit('orderId', orderId);
        dispatch('Dictionaries/initState', orderId);
      } catch (error) {
        let errorData = get(error, 'response.data');
        if (!errorData) {
          console.error(error);
          errorData = {
            code: 'fm000025',
            message: 'Unknown error. Try request later',
          };
        } else {
          console.error(errorData);
        }
        orderData = { error: errorData };
      }
      return orderData;
    },

    async getOrderId({ state }, orderParams) {
      const { data } = await axios.post(
        `${state.apiUrl}/api/v1/order`,
        orderParams,
      );
      return data.id;
    },

    async getOrderData({ state }, orderId) {
      const { data } = await axios.get(
        `${state.apiUrl}/api/v1/order/${orderId}`,
      );
      return data;
    },

    setInitialLocale({ commit }, custom) {
      const initialLocale = getLanguage(
        localesScheme, custom || get(navigator, 'language'),
      );
      commit('initialLocale', initialLocale);
    },

    async recreateOrder({ state, dispatch, rootState }, status) {
      gtagEvent('clickTryAgainButton', { event_category: 'userAction' });
      dispatch('PaymentForm/setPaymentStatus', [status]);

      try {
        const { data } = await axios.post(
          `${rootState.apiUrl}/api/v1/order/recreate`,
          {
            order_id: state.orderId,
          },
        );
        if (state.query.order_id) {
          const query = {
            ...state.query,
            order_id: data.id,
          };
          const url = [window.location.pathname, qs.stringify(query)].filter(item => item).join('?');
          window.history.replaceState({}, '', url);
        }
        const orderData = await dispatch('getPreparedOrderData', { queryOrderId: data.id });
        dispatch('PaymentForm/initState', { orderData });
      } catch (error) {
        console.error(error);
        dispatch('PaymentForm/setPaymentStatus', ['FAILED_TO_BEGIN', error]);
        gtagEvent('orderRecreationError', { error });
      }
    },

    reportResize({ state, commit }, newSize) {
      if (
        state.lastSize.width === newSize.width
        && state.lastSize.height === newSize.height
      ) {
        return;
      }
      commit('lastSize', newSize);
      postMessage('FORM_RESIZE', newSize);
    },
  },

  modules: {
    Dictionaries: DictionariesStore,
    PaymentForm: PaymentFormStore,
  },
});
