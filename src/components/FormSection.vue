<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { email } from 'vuelidate/lib/validators';
import { includes, get } from 'lodash-es';
import FormSectionBankCard from './FormSectionBankCard.vue';

function getRegexp(value) {
  return new RegExp(value);
}

export default {
  name: 'FormSection',
  components: {
    FormSectionBankCard,
  },
  props: {
    layout: {
      type: String,
      default: 'modal',
      validator(value) {
        return includes(['modal', 'page'], value);
      },
    },
  },

  filters: {
    getRegexp,
  },

  data() {
    return {
      email: '',
      ewallet: '',
      paymentMethodOptions: {
        BANKCARD: {
          label: this.$i18n.t('card'),
          iconComponent: 'IconCard',
        },
        NETELLER: {
          label: this.$i18n.t('neteller'),
          iconComponent: 'IconCard',
        },
        ALIPAY: {
          label: this.$i18n.t('alipay'),
          iconComponent: 'IconCard',
          types: {
            ewallet: {
              iconComponent: 'IconCard',
            },
          },
        },
        BITCOIN: {
          label: this.$i18n.t('bitcoin'),
          iconComponent: 'IconCard',
        },
        QIWI: {
          label: this.$i18n.t('qiwi'),
          iconComponent: 'IconQiwi',
        },
        WEBMONEY: {
          label: this.$i18n.t('webmoney'),
          iconComponent: 'IconWebmoney',
        },
      },
    };
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderData',
      'activePaymentMethodId',
    ]),
    ...mapGetters('PaymentForm', ['activePaymentMethod']),

    paymentMethodsSelectList() {
      return this.orderData.payment_methods.map((item) => {
        const group = this.paymentMethodOptions[item.group_alias];
        if (!group) {
          return null;
        }
        const type = group.types ? group.types[item.type] : null;
        return {
          value: item.id,
          label: get(type, 'label') || get(group, 'label'),
          iconComponent: get(type, 'iconComponent') || get(group, 'iconComponent'),
        };
      });
    },

    isBankCardPayment() {
      return this.activePaymentMethod.type === 'bank_card';
    },
  },

  validations: {
    email: { email },
  },

  methods: {
    ...mapActions('PaymentForm', [
      'setActivePaymentMethodById', 'createPayment', 'hidePaymentError', 'usePaymentApi',
    ]),
  },
};
</script>

<template>
<div :class="[$style.formSection, $style[`_layout-${layout}`]]">
  <div :class="$style.content">
    <UiScrollbarBox :class="$style.scrollbox" :settings="{suppressScrollX: true}">
      <div :class="$style.contentInner">
        <UiSelect
          :value="activePaymentMethodId"
          :class="$style.formItem"
          :options="paymentMethodsSelectList"
          :prependLabel="$t('prependLabel')"
          @input="setActivePaymentMethodById"
        />

        <FormSectionBankCard
          v-if="isBankCardPayment"
          ref="bankCardForm"
          :cardNumberValidator="activePaymentMethod.account_regexp | getRegexp"
        />
        <template v-else>
          <UiTextField
            :class="$style.formItem"
            v-model="ewallet"
            mask="UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"
            name="ewallet"
            :hasError="$isFieldInvalid('ewallet')"
            errorText="wtf"
            :label="$t('placeholderEwallet', {name: activePaymentMethod.name})"
          />
          <UiTextField
            :class="$style.formItem"
            v-model="email"
            type="email"
            name="email"
            :hasError="$isFieldInvalid('email')"
            :errorText="$t('emailInvalid')"
            :label="$t('email')"
            @input="email = $event"
            @focus="$v.$touch()"
          />
        </template>
      </div>
    </UiScrollbarBox>
  </div>
  <div :class="$style.footer">
    <UiButton
      :class="$style.payBtn"
      :hasBorderRadius="layout === 'page' ? true : false"
    >
      <IconLock slot="before" />
      PAY $29
    </UiButton>
  </div>
</div>
</template>

<style module lang="scss">
@import '@/assets/styles/directional.scss';

.formSection {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: space-between;
  position: relative;
  height: 100%;
  min-height: 448px;
  width: 100%;
}

.content {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  flex-direction: column;
  align-content: flex-start;
  position: relative;
  width: 100%;
}

.scrollbox {
  width: 100%;
  height: 100%;
  flex-grow: 1;
}

.contentInner {
  .formSection._layout-modal & {
    padding: 0 40px 20px;
  }

  .formSection._layout-page & {
    @media screen and (min-width: 640px) {
      padding: 60px 0;
    }
  }
}

.formItem {
  display: flex;
  justify-content: space-between;
}

.footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.payBtn {
  width: 100%;
}
</style>

<i18n>
{
  "en": {
    "prependLabel": "Pay with",
    "card": "Card",
    "neteller": "Neteller",
    "alipay": "Alipay",
    "bitcoin": "Bitcoin",
    "paypal": "PayPal",
    "yandex": "Yandex.Money",
    "amazon": "Amazon Pay",
    "union": "Union Pay",
    "jcb": "JCB",
    "wechat": "Wechat Pay",
    "qiwi": "QIWI",
    "webmoney": "Webmoney",
    "btc": "BTC",
    "expiryDate": "Expiry date",
    "expiryDateInvalid": "Expiry date is invalid",
    "cvv": "CVC/CVV",
    "cardholder": "Cardholder name",
    "email": "Email to receive the purchase",
    "emailInvalid": "Email is invalid",
    "remember": "Remember me",
    "placeholderEmail": "Enter your email",
    "placeholderEwallet": "{name} wallet number"
  },
  "ru": {
    "prependLabel": "Тип оплаты:",
    "card": "Карта",
    "neteller": "Neteller",
    "alipay": "Alipay",
    "bitcoin": "Bitcoin",
    "paypal": "PayPal",
    "yandex": "Yandex.Money",
    "amazon": "Amazon Pay",
    "union": "Union Pay",
    "jcb": "JCB",
    "wechat": "Wechat Pay",
    "qiwi": "QIWI",
    "webmoney": "Webmoney",
    "btc": "BTC",
    "expiryDate": "Срок действия",
    "expiryDateInvalid": "Неверный срок действия",
    "cvv": "CVC/CVV",
    "cardholder": "Владелец карты",
    "email": "Email",
    "emailInvalid": "Неверный email",
    "remember": "Запомнить",
    "placeholderEmail": "Введите ваш email",
    "placeholderEwallet": "Номер кошелька {name}"
  }
}
</i18n>
