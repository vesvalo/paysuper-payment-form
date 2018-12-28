import axios from 'axios';
import Centrifuge from 'centrifuge';
import assert from 'assert';
import { find, includes } from 'lodash-es';
import { apiPathCreatePayment, websocketServerUrl } from '../settings';
import { postMessage } from '../postMessage';

const allowedPaymentStatuses = [
  'NEW', 'COMPLETED', 'DECLINED', 'PENDING', 'FAILED_TO_CREATE',
];

export default {
  namespaced: true,

  state: {
    orderID: '',
    account: '',
    project: null,
    initialEmail: '',
    paymentMethods: [],
    activePaymentMethodID: '',
    isLoading: false,
    isPaymentErrorVisible: false,
    paymentStatus: 'NEW',
  },

  getters: {
    activePaymentMethod(state) {
      return find(state.paymentMethods, { id: state.activePaymentMethodID });
    },
  },

  mutations: {
    orderID(state, value) {
      state.orderID = value;
    },
    account(state, value) {
      state.account = value;
    },
    project(state, value) {
      state.project = value;
    },
    initialEmail(state, value) {
      state.initialEmail = value;
    },
    paymentMethods(state, value) {
      state.paymentMethods = value;
    },
    activePaymentMethodID(state, value) {
      state.activePaymentMethodID = value;
    },
    isLoading(state, value) {
      state.isLoading = value;
    },
    isPaymentErrorVisible(state, value) {
      state.isPaymentErrorVisible = value;
    },
    paymentStatus(state, value) {
      assert(
        includes(allowedPaymentStatuses, value),
        `Payment status "${value}" is not allowed`,
      );
      state.paymentStatus = value;
    },
  },

  actions: {
    async initState({ commit }, { formData, options }) {
      commit('orderID', formData.id);
      commit('account', formData.account);
      commit('project', formData.project);
      commit('initialEmail', options.email);
      commit('paymentMethods', formData.payment_methods);
      commit('activePaymentMethodID', formData.payment_methods[0].id);

      const centrifuge = new Centrifuge(websocketServerUrl);
      centrifuge.setToken(formData.token);

      const channel = `payment:notify#${formData.id}`;

      centrifuge.subscribe(channel, ({ data }) => {
        // Just in case. Its probably unnecessary
        if (data.order_id !== formData.id) {
          return;
        }

        if (data.status === 'COMPLETED') {
          commit('paymentStatus', 'COMPLETED');
          postMessage('PAYMENT_COMPLETED');
        }

        if (data.status === 'DECLINED') {
          commit('paymentStatus', 'DECLINED');
          postMessage('PAYMENT_DECLINED');
        }
      });

      centrifuge.connect();
    },

    setActivePaymentMethod({ commit }, value) {
      commit('activePaymentMethodID', value);
    },

    hidePaymentError({ commit }) {
      commit('isPaymentErrorVisible', false);
    },

    async createPayment({ state, getters, commit }, {
      cardNumber, month, year, cvv, cardHolder, ewallet, email,
    }) {
      postMessage('PAYMENT_BEFORE_CREATED');
      commit('isLoading', true);

      const request = {
        email,
        month,
        year,
        cvv,
        card_holder: cardHolder,
        order_id: state.orderID,
        pan: cardNumber,
        payment_method_id: state.activePaymentMethodID,
      };
      if (getters.activePaymentMethod.type === 'crypto') {
        request.address = ewallet;
      } else {
        request.ewallet = ewallet;
      }

      try {
        const { data } = await axios.post(
          apiPathCreatePayment,
          request,
        );
        postMessage('PAYMENT_CREATED', {
          redirectUrl: data.redirect_url,
        });
        commit('paymentStatus', 'PENDING');
        postMessage('PAYMENT_PENDING');
      } catch (error) {
        commit('paymentStatus', 'FAILED_TO_CREATE');
        commit('isPaymentErrorVisible', true);
        postMessage('PAYMENT_FAILED_TO_CREATE');
      }
      commit('isLoading', false);
    },
  },
};
