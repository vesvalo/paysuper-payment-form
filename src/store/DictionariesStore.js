import axios from 'axios';
import { sortBy } from 'lodash-es';
import i18n from '@/i18n';

export default {
  namespaced: true,

  state: () => ({
    countries: [],
  }),

  getters: {
    countries(state) {
      const countries = state.countries
        .map(item => ({
          label: i18n.t(`countries.${item.iso_code_a2}`),
          value: item.iso_code_a2,
        }));
      return sortBy(countries, 'label');
    },
  },

  mutations: {
    countries(store, value) {
      store.countries = value;
    },
  },

  actions: {
    initState({ dispatch }, orderId) {
      return dispatch('fetchCountries', orderId);
    },

    async fetchCountries({ commit, rootState }, orderId) {
      const response = await axios.get(`${rootState.apiUrl}/api/v1/payment_countries/${orderId}`)
        .then(({ data }) => data)
        .catch(() => ({
          items: null,
        }));
      commit('countries', response.countries || []);
    },
  },
};
