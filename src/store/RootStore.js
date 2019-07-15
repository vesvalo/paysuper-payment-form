import Vue from 'vue';
import Vuex from 'vuex';
import DictionariesStore from './DictionariesStore';
import PaymentFormStore from './PaymentFormStore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiUrl: '',
  },
  mutations: {
    apiUrl(state, value) {
      state.apiUrl = value;
    },
  },
  actions: {
    async initState({ commit, dispatch }, { orderParams, options }) {
      commit('apiUrl', options.apiUrl);

      await Promise.all([
        dispatch('Dictionaries/initState'),
        dispatch('PaymentForm/initState', { orderParams, options }),
      ]);
    },
  },

  modules: {
    Dictionaries: DictionariesStore,
    PaymentForm: PaymentFormStore,
  },
});
