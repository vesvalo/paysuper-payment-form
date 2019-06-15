<template>
  <div class="status-messages">

    <div class="status-messages-frame" v-if="paymentStatus === 'PENDING'">
      <div class="status-messages-frame__inner">
        <IconLoadingAnimated width="40" height="40" stroke="black" />
        <p class="status-messages-frame__text">
          {{ $t('waitingForPaymentResult') }}
        </p>
      </div>
    </div>

    <div class="status-messages-frame _success" v-if="paymentStatus === 'COMPLETED'">
      <div class="status-messages-frame__inner">
        <IconSuccess width="40" height="40" />
        <p class="status-messages-frame__text">
          {{ $t('paymentCompleted') }}
        </p>
      </div>
      <div class="status-messages-frame__inner">
        <div class="payment-report">
          <ul class="payment-report-list">
            <li class="payment-report-list__item">
              <span class="payment-report-list__key">{{ $t('product') }}</span>
              <span class="payment-report-list__value">{{project.name}}</span>
            </li>
            <li class="payment-report-list__item">
              <span class="payment-report-list__key">{{ $t('orderId') }}</span>
              <span class="payment-report-list__value">{{orderId}}</span>
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
      class="status-messages-frame _failed"
      v-if="includes(['CANCELLED', 'DECLINED', 'INTERRUPTED'], paymentStatus)"
    >
      <div class="status-messages-frame__inner">
        <IconWarning width="40" height="40" />
        <p class="status-messages-frame__text">
          <span v-if="paymentStatus === 'CANCELLED'" v-text="$t('paymentCancelled')"></span>
          <span v-if="paymentStatus === 'DECLINED'" v-text="$t('paymentDeclined')"></span>
          <span v-if="paymentStatus === 'INTERRUPTED'" v-text="$t('paymentInterrupted')"></span>
        </p>
      </div>
      <div class="status-messages-frame__inner" v-if="paymentResultMessage">
        {{ $t('reason') }}: {{paymentResultMessage}}
      </div>
      <div class="status-messages-frame__inner">
        {{ $t('tryAgainQuestion') }}
      </div>
      <div class="status-messages-frame__inner">
        <base-button class="retry-payment-button" size="big" @click="$emit('recreateOrder')">
          {{ $t('retryPayment') }}
        </base-button>
      </div>
    </div>

    <div class="status-messages-frame _failed" v-if="isAppFailed">
      <div class="status-messages-frame__inner" v-for="text in $t('paymentInitFailed')" :key="text">
        {{text}}
      </div>
    </div>

  </div>
</template>

<script>
import { includes } from 'lodash-es';

export default {
  name: 'StatusMessages',

  props: {
    paymentStatus: {
      required: true,
      type: String,
    },

    isAppFailed: {
      required: true,
      type: Boolean,
    },

    paymentResultMessage: {
      required: true,
      type: String,
    },

    activePaymentMethod: {
      required: true,
      type: Object,
    },

    project: {
      required: true,
      type: Object,
    },

    orderId: {
      required: true,
      type: String,
    },
  },

  methods: {
    includes,
  },
};

</script>

<style lang="scss">
.status-messages {
}

.status-messages-frame {
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

  @include onBreakpoint('s') {
    line-height: 24px;
  }

  &__inner {
    display: flex;
    justify-content: center;
    align-items: center;

    @include onBreakpoint('s') {
      flex-direction: column;
    }

    & + & {
      margin-top: 5px;
    }

    & > svg {
      margin-right: 12px;
    }
  }

  &__text {
    margin: 5px 0 0;
  }

  &._failed {
    border-color: $ui-color-grey72;
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

  @include onBreakpoint('s') {
    width: 280px;
    margin-bottom: 0;
  }
}

.payment-report-list {
  &__item {
    color: $ui-color-grey13;
    font-size: 13px;
    line-height: 16px;
    display: flex;
    justify-content: space-between;

    &::before {
      content: ' ';
      flex-grow: 1;
      order: 1;
      border-bottom: 1px dotted #999;
    }

    & + & {
      margin-top: 8px;
    }

    @include onBreakpoint('s') {
      display: block;

      &::before {
        display: none;
      }
    }
  }

  &__key {
    order: 0;

    @include onBreakpoint('s') {
      display: block;
      font-weight: bold;
    }
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
    "waitingForPaymentResult": "Waiting for the payment to resolve",
    "paymentCreated": "Almost done!",
    "setPaymentPending": "Finish the payment",
    "paymentCompleted": "Payment completed",
    "paymentDeclined": "Payment declined",
    "paymentCancelled": "Payment cancelled",
    "paymentInterrupted": "Payment interrupted",
    "reason": "Reason",
    "tryAgainQuestion": "No worries! Let's try again?",
    "retryPayment": "Retry the payment"
  },
  "ru": {
    "paymentInitFailed": [
      "Не удалось отобразить форму оплаты",
      "Пожалуйста, попробуйте снова чуть позже"
    ],
    "waitingForPaymentResult": "Ожидаем исполнения платежа",
    "paymentCreated": "Почти готово!",
    "setPaymentPending": "Завершить платёж",
    "paymentCompleted": "Платёж выполнен успешно",
    "paymentDeclined": "Отказано в платеже",
    "paymentCancelled": "Платёж отменён",
    "paymentInterrupted": "Платёж прерван",
    "reason": "Причина",
    "tryAgainQuestion": "Не беда! Попробуем ещё раз?",
    "retryPayment": "Повторить платёж"
  }
}
</i18n>
