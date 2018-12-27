<template>
  <div class="app">
    <!-- <button class="app__close" v-if="isInModal" @click="$root.$emit('closeModal')">
      <IconClose width="16" height="16" fill="#999" />
    </button> -->

    <PaymentForm v-if="orderID" />
    <div class="app-failed" v-else>
      <base-error-text>
        <p v-for="text in $t('paymentInitFailed')" :key="text">{{text}}</p>
      </base-error-text>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PaymentForm from './components/PaymentForm.vue';
import postMessage from './postMessage';

export default {
  name: 'App',
  components: {
    PaymentForm,
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderID',
    ]),
  },

  mounted() {
    postMessage('LOADED');
  },
};

</script>

<style lang="scss">
@import "@/assets/styles/gui.scss";

* {
  box-sizing: border-box;
}

.app {
}

.app-failed {
  background: $ui-color-white;
  border: 1px solid $ui-color-grey87;
  width: 560px;
  padding: 20px;
  box-sizing: border-box;
  color: $ui-color-grey13;
  font-family: $ui-font-family-common;
  font-size: 13px;
  line-height: 16px;
}
</style>

<i18n>
{
  "en": {
    "paymentInitFailed": [
      "Payment form initialization failed.",
      "This is probably happened because we could not handle payment request.",
      "Try again after refreshing the page or later."
    ]
  },
  "ru": {
    "paymentInitFailed": [
      "Не удалось отображить форму оплаты.",
      "Скорее всего, проблема в том, что мы не смогли обратать запрос на создание платежа.",
      "Попробуйте снова, обновив страницу. Либо, попробуйте позже."
    ]
  }
}
</i18n>
