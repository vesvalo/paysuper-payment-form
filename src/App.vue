<script>
import {
  mapState, mapGetters, mapActions, mapMutations,
} from 'vuex';
import { includes } from 'lodash-es';
import PaymentForm from './components/PaymentForm.vue';
import StatusMessages from './components/StatusMessages.vue';
import { postMessage } from './postMessage';

export default {
  name: 'App',
  components: {
    PaymentForm,
    StatusMessages,
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderID',
      'project',
      'paymentStatus',
      'paymentResultMessage',
    ]),

    ...mapGetters('PaymentForm', ['activePaymentMethod']),

    isPaymentFormVisible() {
      const allowedStatuses = ['NEW', 'FAILED_TO_CREATE'];
      if (this.orderID && includes(allowedStatuses, this.paymentStatus)) {
        return true;
      }

      return false;
    },

    isAppFailed() {
      return !this.orderID;
    },
  },

  watch: {
    paymentStatus() {
      this.reportAppResize();
    },
  },

  mounted() {
    this.reportAppResize();
    postMessage('LOADED');
  },

  methods: {
    ...mapActions(['reportResize']),
    ...mapActions('PaymentForm', ['finishPaymentCreation']),

    ...mapMutations('PaymentForm', { setPaymentStatus: 'paymentStatus' }),

    reportAppResize() {
      setTimeout(() => {
        const size = {
          height: this.$el.offsetHeight,
          width: this.$el.offsetWidth,
        };
        postMessage('FORM_RESIZE', size);
      }, 0);
    },

    recreateOrder() {
      postMessage('ORDER_RECREATE_STARTED');
    },
  },
};
</script>

<template>
  <div class="app">

    <!-- DEBUG -->
    <div style="position: absolute; z-index: 10;" v-if="false">
      <button @click="setPaymentStatus('DECLINED')">TO DECLINED</button>
      <button @click="setPaymentStatus('CANCELLED')">TO CANCELLED</button>
      <button @click="setPaymentStatus('PENDING')">TO PENDING</button>
      <button @click="setPaymentStatus('COMPLETED')">TO COMPLETED</button>
    </div>
    <!-- /DEBUG -->

    <StatusMessages
      :paymentStatus="paymentStatus"
      :isAppFailed="isAppFailed"
      :paymentResultMessage="paymentResultMessage"
      :activePaymentMethod="activePaymentMethod"
      :project="project"
      :orderID="orderID"
      @recreateOrder="recreateOrder"
     />

    <PaymentForm v-if="isPaymentFormVisible" />

  </div>
</template>

<style lang="scss">
body {
  margin: 0;

  &.inside-iframe {
    overflow: hidden;
  }
}

* {
  box-sizing: border-box;
}

p {
  margin: 0;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>

<style lang="scss">
@import "@/assets/styles/gui.scss";

.app {
  width: 560px;
  position: relative;
}
</style>
