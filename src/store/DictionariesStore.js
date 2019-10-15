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
        .filter(item => item.payments_allowed)
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
    initState({ dispatch }) {
      return Promise.all([
        dispatch('fetchCountries'),
        dispatch('fetchPlatforms'),
      ]);
    },

    getCountries({ rootState }) {
      const url = `${rootState.apiUrl}/api/v1/country`;

      return axios.get(url)
        .then(response => response.data)
        .catch(() => ({
          items: null,
        }));
    },

    async fetchCountries({ commit, dispatch }) {
      const response = await dispatch('getCountries');
      commit('countries', response.countries);
    },

    async fetchPlatforms({ rootState }) {
      const url = `${rootState.apiUrl}/admin/api/v1/platforms`;

      const { data } = await axios.get(url)
        .then(response => response.data)
        .catch(() => ({
          // items: null,
        }));

      console.log(11111, 'data', data);
    },
  },
};
