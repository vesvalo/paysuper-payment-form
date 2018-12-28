<template>
  <div class="app">
    <div class="app-message" v-if="paymentStatus === 'PENDING'">
      <div class="app-message__inner">
        <IconLoadingAnimated width="50" height="50" stroke="black" />
        {{ $t('waitingForPaymentResult') }}
      </div>
    </div>

    <div class="app-message _success" v-if="paymentStatus === 'COMPLETED'">
      <div class="app-message__inner">
        <IconSuccess />
        {{ $t('paymentCompleted') }}
      </div>
    </div>

    <div class="app-message _failed" v-if="paymentStatus === 'DECLINED'">
      <div class="app-message__inner">
        <IconWarning />
        {{ $t('paymentDeclined') }}
      </div>
    </div>

    <PaymentForm v-if="isPaymentFormVisible" />

    <div class="app-message _failed" v-if="isAppFailed" ref="appFailed">
      <div class="app-message__inner" v-for="text in $t('paymentInitFailed')" :key="text">
        {{text}}
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
    if (this.$refs.appFailed) {
      this.reportAppResize();
    }
    postMessage('LOADED');
  },

  methods: {
    ...mapActions(['reportResize']),
    ...mapActions('PaymentForm', ['finishPaymentCreation']),
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
}

.app-message {
  background: $ui-color-white;
  height: 200px;
  padding: 20px;
  box-sizing: border-box;
  color: $ui-color-grey13;
  font-family: $ui-font-family-common;
  font-size: 20px;
  line-height: 24px;
  border: 5px solid #ffdb4d;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &__inner {
    display: flex;
    justify-content: center;
    align-items: center;

    & + & {
      margin-top: 5px;
    }
  }

  &._failed {
    border-color: #e95555;
  }

  &._success {
    border-color: #7ae955;
  }

  svg {
    margin-right: 12px;
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
    "waitingForPaymentResult": "Waiting for the payment result",
    "paymentCreated": "Almost done!",
    "setPaymentPending": "Finish the payment",
    "paymentCompleted": "Payment completed",
    "paymentDeclined": "Payment declined"
  },
  "ru": {
    "paymentInitFailed": [
      "Не удалось отобразить форму оплаты",
      "Пожалуйста, попробуйте снова чуть позже"
    ],
    "waitingForPaymentResult": "Ожидаем результат платежа",
    "paymentCreated": "Почти готово!",
    "setPaymentPending": "Завершить платёж",
    "paymentCompleted": "Платёж выполнен успешно",
    "paymentDeclined": "Отказано в платеже"
  }
}
</i18n>
