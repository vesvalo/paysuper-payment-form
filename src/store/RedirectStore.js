import { get } from 'lodash-es';

export default {
  namespaced: true,
  state: {
    orderData: {
      project: {
        name: '',
      },
    },
    formUsage: 'standalone',
  },
  getters: {
    redirectMode(state) {
      return get(state.orderData, 'project.redirect_settings.mode', 'disable');
    },
    isRedirect(state, getters, rootState, rootGetters) {
      const isPaymentSuccess = rootGetters['PaymentForm/isPaymentSuccess'];
      const isPaymentFailed = rootGetters['PaymentForm/isPaymentFailed'];
      const isFormTypeAccordance = getters.redirectFormType === 'any'
        || getters.redirectFormType === state.formUsage;
      const isRedirectModeAccordance = (
        getters.redirectMode === 'any' && (isPaymentSuccess || isPaymentFailed)
      )
        || (getters.redirectMode === 'successful' && isPaymentSuccess)
        || (getters.redirectMode === 'fail' && isPaymentFailed);

      return isFormTypeAccordance && isRedirectModeAccordance;
    },
    redirectDelay(state) {
      return get(state.orderData, 'project.redirect_settings.delay', 0);
    },
    isAutoRedirect(state, getters) {
      return getters.redirectDelay > 0;
    },
    redirectFormType(state) {
      return get(state.orderData, 'project.redirect_settings.usage', 'any');
    },
    redirectSuccessUrl(state) {
      return get(state.orderData, 'project.url_success', '');
    },
    redirectFailUrl(state) {
      return get(state.orderData, 'project.url_fail', '');
    },
    hasTimer(state, getters) {
      return getters.isRedirect && getters.isAutoRedirect;
    },
  },
  actions: {
    initState({ commit }, { orderData, formUsage }) {
      commit('orderData', orderData);
      commit('formUsage', formUsage);
    },
    initRedirectTimeout({ getters, rootGetters }) {
      if (getters.isRedirect && getters.isAutoRedirect) {
        const redirectUrl = rootGetters['PaymentForm/isPaymentFailed']
          ? getters.redirectFailUrl
          : getters.redirectSuccessUrl;
        setTimeout(() => window.location.replace(redirectUrl), getters.redirectDelay * 1000);
      }
    },
  },
  mutations: {
    orderData(state, value) {
      state.orderData = value;
    },
    formUsage(state, value) {
      state.formUsage = value;
    },
  },
};
