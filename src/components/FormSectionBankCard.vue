<template>
<div :class="[$style.formSectionBankCard]">
  <UiCardField
    v-model="cardNumber"
    :class="$style.formItem"
    :hasError="$isFieldInvalid('cardNumber')"
    :errorText="$t('cardNumberInvalid')"
    @input="cardNumber = $event"
    name="pan"
  />
  <div :class="$style.formItem">
    <UiTextField
      v-model="expiryDate"
      mask="##/##"
      name="cc-exp"
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
      name="cvv"
      :class="$style.cvv"
      :label="$t('cvv')"
      @input="cvv = $event"
    />
  </div>
  <UiTextField
    v-model="cardHolder"
    mask="UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"
    name="card_holder"
    :class="$style.formItem"
    :label="$t('cardholder')"
    @input="cardHolder = $event"
  />
  <UiTextField
    v-model="email"
    type="email"
    name="email"
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
  name: 'FormSectionBankCard',
  props: {
    cardNumberValidator: {
      required: true,
      type: RegExp,
    },
  },
  data() {
    return {
      email: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: '',
      hasRemembered: false,
    };
  },
  validations: {
    cardNumber: {
      wrongFormatType(value) {
        return this.cardNumberValidator.test(value);
      },
    },
    email: { email },
    expiryDate: { isValidExpiryDate },
  },
};
</script>

<style module lang="scss">
@import '@/assets/styles/directional.scss';

.formSectionBankCard {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  align-content: flex-start;
  height: 100%;
  overflow: hidden;
}
.formItem {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.expiry {
  @include if-ltr {
    margin-right: 20px;
  }
}
.cvv {
  @include if-rtl {
    margin-right: 20px;
  }
}
.remember {
  padding: 18px 0;
}
</style>

<i18n>
{
  "en": {
    "cardNumberInvalid": "Card number is invalid",
    "expiryDate": "Expiry date",
    "expiryDateInvalid": "Expiry date is invalid",
    "cvv": "CVC/CVV",
    "cardholder": "Cardholder name",
    "email": "Email to receive the purchase",
    "emailInvalid": "Email is invalid",
    "remember": "Remember me"
  },
  "ru": {
    "cardNumberInvalid": "Неверный номер карты",
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
