<template>
<div :class="[$style.formSection, { [$style._hasPadding]: hasPadding }]">
  <UiSelect
    v-model="payType"
    :class="$style.formItem"
    :options="options"
    :prependLabel="$t('prependLabel')"
    @input="payType = $event"
  />
  <UiCardField
    v-model="cardNumber"
    :class="$style.formItem"
    @input="cardNumber = $event"
  />
  <div :class="$style.formItem">
    <UiTextField
      v-model="expiryDate"
      mask="##/##"
      :class="$style.expiry"
      :hasError="$isFieldInvalid('expiryDate')"
      :errorText="$t('expiryDateInvalid')"
      :label="$t('expiryDate')"
      @input="expiryDate = $event"
      @focus="$v.$touch()"
    />
    <UiTextField
      v-model="cvv"
      mask="###"
      type="password"
      :label="$t('cvv')"
      @input="cvv = $event"
    />
  </div>
  <UiTextField
    v-model="cardHolder"
    mask="UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"
    :class="$style.formItem"
    :label="$t('cardholder')"
    @input="cardHolder = $event"
  />
  <UiTextField
    v-model="email"
    type="email"
    :class="$style.formItem"
    :hasError="$isFieldInvalid('email')"
    :errorText="$t('emailInvalid')"
    :label="$t('email')"
    @input="email = $event"
    @focus="$v.$touch()"
  />
  <div :class="[$style.formItem, $style.remember]">
    <UiCheckbox
      v-model="hasRemembered"
      @input="hasRemembered = $event"
    >
      {{ $t('remember') }}
    </UiCheckbox>
  </div>
</div>
</template>

<script>
import { email } from 'vuelidate/lib/validators';
import { toInteger } from 'lodash-es';

function isValidExpiryDate(date) {
  if (date.length < 2) {
    return true;
  }
  if (date.length === 2 || date.length === 3) {
    const month = toInteger(date.substring(0, 2));

    if (month < 1 || month > 12) {
      return false;
    }

    return true;
  }
  if (date.length > 4) {
    return false;
  }

  const month = toInteger(date.substring(0, 2));
  const year = toInteger(date.substring(2));

  if (month < 1 || month > 12 || year < 0 || year > 99) {
    return false;
  }

  return true;
}

export default {
  name: 'FormSection',
  props: {
    hasPadding: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      payType: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: '',
      email: '',
      hasRemembered: false,
      options: [
        { value: 'card', label: this.$i18n.t('card'), iconComponent: 'IconCard' },
        { value: 'paypal', label: this.$i18n.t('paypal'), iconComponent: 'IconCard' },
        { value: 'yandex', label: this.$i18n.t('yandex'), iconComponent: 'IconCard' },
        { value: 'amazon', label: this.$i18n.t('amazon'), iconComponent: 'IconCard' },
        { value: 'union', label: this.$i18n.t('union'), iconComponent: 'IconCard' },
        { value: 'jcb', label: this.$i18n.t('jcb'), iconComponent: 'IconCard' },
        { value: 'wechat', label: this.$i18n.t('wechat'), iconComponent: 'IconCard' },
        { value: 'qiwi', label: this.$i18n.t('qiwi'), iconComponent: 'IconCard' },
        { value: 'webmoney', label: this.$i18n.t('webmoney'), iconComponent: 'IconCard' },
        { value: 'btc', label: this.$i18n.t('btc'), iconComponent: 'IconCard' },
      ],
    };
  },
  validations: {
    email: { email },
    expiryDate: { isValidExpiryDate },
  },
  computed: {},
  methods: {},
};
</script>

<style module lang="scss">
.formSection {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  align-content: flex-start;
  height: 100%;
  overflow: hidden;

  &._hasPadding {
    padding: 0 40px 20px;
  }
}
.formItem {
  display: flex;
  justify-content: space-between;
}
.expiry {
  margin-right: 20px;
}
.remember {
  padding: 18px 0;
}
</style>

<i18n>
{
  "en": {
    "prependLabel": "Pay with",
    "card": "Card",
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
    "remember": "Remember me"
  },
  "ru": {
    "prependLabel": "Тип оплаты:",
    "card": "Карта",
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
    "remember": "Запомнить"
  }
}
</i18n>
