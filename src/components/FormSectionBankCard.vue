<template>
<div :class="[$style.formSectionBankCard]">
  <UiCardField
    v-model="innerValue.cardNumber"
    :class="$style.formItem"
    :hasError="$isFieldInvalid('innerValue.cardNumber')"
    :errorText="$t('FormSectionBankCard.cardNumberInvalid')"
    name="pan"
  />
  <div :class="$style.formItem">
    <UiTextField
      v-model="innerValue.expiryDate"
      mask="##/##"
      name="cc-exp"
      :class="$style.expiry"
      :hasError="$isFieldInvalid('innerValue.expiryDate')"
      :errorText="$t('FormSectionBankCard.expiryDateInvalid')"
      :label="$t('FormSectionBankCard.expiryDate')"
    />
    <UiTextField
      :class="$style.cvv"
      v-model="innerValue.cvv"
      mask="###"
      type="password"
      name="cvv"
      :hasError="$isFieldInvalid('innerValue.cvv')"
      :errorText="$t('FormSectionBankCard.cvvError')"
      :label="$t('FormSectionBankCard.cvv')"
    />
  </div>
  <UiTextField
    v-model="innerValue.cardHolder"
    mask="UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"
    name="card_holder"
    :hasError="$isFieldInvalid('innerValue.cardHolder')"
    :errorText="$t('FormSectionBankCard.cardHolderError')"
    :class="$style.formItem"
    :label="$t('FormSectionBankCard.cardholder')"
  />
  <UiTextField
    :class="$style.formItem"
    v-if="!initialEmail"
    v-model="innerValue.email"
    type="email"
    name="email"
    :hasError="$isFieldInvalid('innerValue.email')"
    :errorText="$t('FormSectionBankCard.emailInvalid')"
    :label="$t('FormSectionBankCard.email')"
  />
  <div :class="[$style.formItem, $style.remember]">
    <UiCheckbox
      v-model="innerValue.hasRemembered"
    >
      {{ $t('FormSectionBankCard.remember') }}
    </UiCheckbox>
  </div>
</div>
</template>

<script>
import { email, required, minLength } from 'vuelidate/lib/validators';
import { toInteger, extend } from 'lodash-es';

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
    initialEmail: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
    },
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  data() {
    return {
      innerValue: {
        email: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: '',
        hasRemembered: false,
      },
    };
  },

  watch: {
    value(value) {
      extend(this.innerValue, value);
    },

    innerValue: {
      handler(value) {
        this.$emit('change', value);
      },
      deep: true,
    },
  },

  validations() {
    const lala = {
      innerValue: {
        cardNumber: {
          required,
          wrongFormatType(value) {
            return this.cardNumberValidator.test(value);
          },
        },
        expiryDate: { required, isValidExpiryDate },
        cvv: {
          required,
          minLength: minLength(3),
        },
        cardHolder: {
          required,
        },
        ...(
          !this.initialEmail
            ? { email: { required, email } }
            : {}
        ),
      },
    };

    return lala;
  },

  methods: {
    validate() {
      this.$v.$touch();
      return {
        isValid: !this.$v.$invalid,
      };
    },
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
