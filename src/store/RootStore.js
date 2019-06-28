import Vue from 'vue';
import Vuex from 'vuex';
import PaymentFormStore from './PaymentFormStore';
import DictionariesStore from './DictionariesStore';

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
        dispatch('PaymentForm/initState', { orderParams, options }),
        dispatch('Dictionaries/initState'),
      ]);
    },
  },

  modules: {
    PaymentForm: PaymentFormStore,
    Dictionaries: DictionariesStore,
  },
});
