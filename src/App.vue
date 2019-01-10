<template>
  <div class="app">

    <!-- DEBUG -->
    <div style="position: absolute; z-index: 10;" v-if="false">
      <button @click="setPaymentStatus('DECLINED')">TO DECLINED</button>
      <button @click="setPaymentStatus('CANCELLED')">TO CANCELLED</button>
    </div>
    <!-- /DEBUG -->

    <div class="app-message" v-if="paymentStatus === 'PENDING'">
      <div class="app-message__inner">
        <IconLoadingAnimated width="40" height="40" stroke="black" />
        {{ $t('waitingForPaymentResult') }}
      </div>
    </div>

    <div class="app-message _success" v-if="paymentStatus === 'COMPLETED'">
      <div class="app-message__inner">
        <IconSuccess width="40" height="40" />
        {{ $t('paymentCompleted') }}
      </div>
      <div class="app-message__inner">
        <div class="payment-report">
          <ul class="payment-report-list">
            <li class="payment-report-list__item">
              <span class="payment-report-list__key">{{ $t('product') }}</span>
              <span class="payment-report-list__value">{{project.name}}</span>
            </li>
            <li class="payment-report-list__item">
              <span class="payment-report-list__key">{{ $t('orderID') }}</span>
              <span class="payment-report-list__value">{{orderID}}</span>
            </li>
            <li class="payment-report-list__item">
              <span class="payment-report-list__key">{{ $t('vat') }}</span>
              <span class="payment-report-list__value">
                {{activePaymentMethod.vat_amount}}
                {{activePaymentMethod.currency}}
              </span>
            </li>
          </ul>
          <div class="payment-report-summ">
            <span class="payment-report-summ__key">{{ $t('summ') }}</span>
            <span class="payment-report-summ__value">
              {{activePaymentMethod.amount_with_commissions}}
              {{activePaymentMethod.currency}}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="app-message _failed"
      v-if="paymentStatus === 'CANCELLED' || paymentStatus === 'DECLINED'"
    >
      <div class="app-message__inner">
        <IconWarning width="40" height="40" />
        <span v-if="paymentStatus === 'CANCELLED'" v-text="$t('paymentCancelled')"></span>
        <span v-if="paymentStatus === 'DECLINED'" v-text="$t('paymentDeclined')"></span>
      </div>
      <div class="app-message__inner" v-if="paymentResultMessage">
        {{ $t('reason') }}: {{paymentResultMessage}}
      </div>
      <div class="app-message__inner">
        {{ $t('tryAgainQuestion') }}
      </div>
      <div class="app-message__inner">
        <base-button class="retry-payment-button" size="big" @click="recreateOrder">
          {{ $t('retryPayment') }}
        </base-button>
      </div>
    </div>

    <PaymentForm v-if="isPaymentFormVisible" />

    <div class="app-message _failed" v-if="isAppFailed">
      <div class="app-message__inner" v-for="text in $t('paymentInitFailed')" :key="text">
        {{text}}
      </div>
    </div>

  </div>
</template>

<script>
import {
  mapState, mapGetters, mapActions, mapMutations,
} from 'vuex';
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
  min-height: 200px;
  padding: 20px;
  box-sizing: border-box;
  font-family: $ui-font-family-common;
  color: $ui-color-grey13;
  font-size: 18px;
  line-height: 30px;
  border: 4px solid #ffdb4d;
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

    & > svg {
      margin-right: 12px;
    }
  }

  &._failed {
    border-color: #323232;
  }

  &._success {
    border-color: #7ae955;
  }
}

.payment-report {
  background: rgba(0, 0, 0, 0.1);
  width: 350px;
  padding: 20px;
  margin: 10px 0 10px;
}

.payment-report-list {
  &__item {
    color: $ui-color-grey13;
    font-size: 13px;
    line-height: 16px;
    display: flex;
    justify-content: space-between;

    &::before {
      content: " ";
      flex-grow: 1;
      order: 1;
      border-bottom: 1px dotted #999;
    }

    & + & {
      margin-top: 8px;
    }
  }

  &__key {
    order: 0;
  }

  &__value {
    order: 2;
  }
}

.payment-report-summ {
  margin-top: 25px;
  padding-top: 5px;
  border-top: 1px solid #999;
  color: $ui-color-grey13;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  line-height: 20px;
}

.retry-payment-button {
  margin-top: 12px;
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
    "paymentDeclined": "Payment declined",
    "paymentCancelled": "Payment cancelled",
    "reason": "Reason",
    "tryAgainQuestion": "No worries! Let's try again?",
    "retryPayment": "Retry the payment"
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
    "paymentDeclined": "Отказано в платеже",
    "paymentCancelled": "Платёж отменён",
    "reason": "Причина",
    "tryAgainQuestion": "Не беда! Попробуем ещё раз?",
    "retryPayment": "Повторить платёж"
  }
}
</i18n>
