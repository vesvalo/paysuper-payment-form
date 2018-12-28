<template>
  <div class="app">
    <div class="app-preloader" v-if="paymentStatus === 'PENDING'">
      <div class="app-preloader__inner">
        <p class="app-preloader__text" v-html="$t('waitingForPaymentResult')"></p>
        <IconLoadingAnimated class="app-preloader__icon" stroke="black" />
      </div>
    </div>

    <div class="app-message _result" v-if="paymentStatus === 'COMPLETED'">
      <IconSuccess />
      {{ $t('paymentCompleted') }}
    </div>

    <div class="app-message _result" v-if="paymentStatus === 'DECLINED'">
      <IconWarning />
      {{ $t('paymentDeclined') }}
    </div>

    <PaymentForm v-if="isPaymentFormVisible"  />

    <div class="app-message _failed" v-if="isAppFailed" ref="appFailed">
      <div>
        <p v-for="text in $t('paymentInitFailed')" :key="text">{{text}}</p>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { includes } from 'lodash-es';
import PaymentForm from './components/PaymentForm.vue';
import { postMessage } from './postMessage';

export default {
  name: 'App',
  components: {
    PaymentForm,
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderID',
      'paymentStatus',
    ]),

    isPaymentFormVisible() {
      const allowedStatuses = ['NEW', 'PENDING', 'FAILED_TO_CREATE'];
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
    if (this.$refs.appFailed) {
      this.reportAppResize();
    }
    postMessage('LOADED');
  },

  methods: {
    ...mapActions(['reportResize']),

    reportAppResize() {
      setTimeout(() => {
        const size = {
          height: this.$el.offsetHeight,
          width: this.$el.offsetWidth,
        };
        postMessage('FORM_RESIZE', size);
      }, 0);
    },
  },
};

</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

p {
  margin: 0;
}
</style>

<style lang="scss">
@import "@/assets/styles/gui.scss";

.app {
  width: 560px;
  position: relative;
}

.app-preloader {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    height: 90px;
    text-align: center;
  }

  &__text {
    margin-bottom: 10px;
    color: $ui-color-grey13;
    font-family: $ui-font-family-common;
    font-size: 14px;
    line-height: 18px;
  }

  &__icon {
  }
}

.app-message {
  background: $ui-color-white;
  height: 160px;
  padding: 20px;
  box-sizing: border-box;
  color: $ui-color-grey13;
  font-family: $ui-font-family-common;
  font-size: 16px;
  line-height: 20px;
  border: 5px solid #ffdb4d;
  display: flex;
  justify-content: center;
  align-items: center;

  &._failed {
    text-align: center;

    p {
      margin-bottom: 5px;
    }
  }

  &._result {
    color: $ui-color-grey13;
    font-size: 20px;
    line-height: 24px;

    svg {
      margin-right: 12px;
    }
  }
}
</style>

<i18n>
{
  "en": {
    "paymentInitFailed": [
      "Payment form is failed to initialize",
      "Please try again later"
    ],
    "waitingForPaymentResult": "Waiting for the payment result<br>It may take a few minutes",
    "paymentCompleted": "Payment completed",
    "paymentDeclined": "Payment declined"
  },
  "ru": {
    "paymentInitFailed": [
      "Не удалось отобразить форму оплаты",
      "Пожалуйста, попробуйте снова чуть позже"
    ],
    "waitingForPaymentResult": "Ожидаем результат платежа<br>Это может занять несколько минут",
    "paymentCompleted": "Платёж выполнен успешно",
    "paymentDeclined": "Отказано в платеже"
  }
}
</i18n>
