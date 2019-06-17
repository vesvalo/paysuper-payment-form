<template>
<div :class="[$style.formSectionBankCard]">
  <UiCardSelect
    v-if="hasCardsInStorage && !anotherCard"
    v-model="innerValue.cardNumber"
    :class="$style.formItem"
    :cards="cards"
    :hasError="$isFieldInvalid('innerValue.cardNumber')"
    :errorText="$t('FormSectionBankCard.cardNumberInvalid')"
    @anotherCard="anotherCard = true"
    @removeCard="$emit('removeCard', $event)"
  />
  <UiCardField
    v-else
    v-model="innerValue.cardNumber"
    name="pan"
    :class="$style.formItem"
    :hasError="$isFieldInvalid('innerValue.cardNumber')"
    :errorText="$t('FormSectionBankCard.cardNumberInvalid')"
  />
  <div :class="$style.formItem">
    <UiTextField
      v-model="innerValue.expiryDate"
      name="cc-exp"
      mask="##/##"
      :class="$style.expiry"
      :hasError="$isFieldInvalid('innerValue.expiryDate')"
      :errorText="$t('FormSectionBankCard.expiryDateInvalid')"
      :label="$t('FormSectionBankCard.expiryDate')"
    />
    <div :class="$style.cvvBox">
      <UiTextField
        v-model="innerValue.cvv"
        name="cvv"
        mask="###"
        type="password"
        :hasError="$isFieldInvalid('innerValue.cvv')"
        :errorText="$t('FormSectionBankCard.cvvError')"
        :label="$t('FormSectionBankCard.cvv')"
      />
      <IconInfo :class="$style.cvvInfo" />
    </div>
  </div>
  <UiTextField
    v-model="innerValue.cardHolder"
    name="card_holder"
    mask="UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"
    :hasError="$isFieldInvalid('innerValue.cardHolder')"
    :errorText="$t('FormSectionBankCard.cardHolderError')"
    :class="$style.formItem"
    :label="$t('FormSectionBankCard.cardholder')"
  />
  <UiTextField
    v-model="innerValue.email"
    name="email"
    type="email"
    :class="$style.formItem"
    :hasError="$isFieldInvalid('innerValue.email')"
    :errorText="$t('FormSectionBankCard.emailInvalid')"
    :label="$t('FormSectionBankCard.email')"
  />
  <UiSelect
    :value="country"
    :options="countries"
    :placeholderLabel="$t('FormSectionBankCard.country')"
    :hasClickawayBlur="false"
    @blur="handleCountrySelectBlur"
    @input="$emit('changeCountry', $event)"
  />
  <div
    v-if="!hasCardsInStorage || anotherCard"
    :class="[$style.formItem, $style.remember]"
  >
    <UiCheckbox v-model="innerValue.hasRemembered">
      {{ $t('FormSectionBankCard.remember') }}
      <IconInfo :class="$style.rememberInfo" />
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
    /**
     * @typedef {{ cardNumber: string, expiryDate: string, cardHolder: string }} Card
     * @type {Card[]}
     */
    cards: {
      default: () => [],
      type: Array,
    },
    value: {
      type: Object,
    },
    country: {
      type: String,
      required: true,
    },
    countries: {
      type: Array,
      required: true,
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
      anotherCard: false,
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
    return {
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
        email: {
          required,
          email,
        },
      },
    };
  },

  computed: {
    hasCardsInStorage() {
      return this.cards.length;
    },
  },

  methods: {
    validate() {
      this.$v.$touch();
      return {
        isValid: !this.$v.$invalid,
      };
    },
    handleCountrySelectBlur() {
      setTimeout(() => {
        this.$emit('updateScrollbar');
      }, 300);
    },
  },
};
</script>

<style module lang="scss">
.formSectionBankCard {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  align-content: flex-start;
  height: 100%;
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
.cvvBox {
  position: relative;
  width: 100%;

  @include if-rtl {
    margin-right: 20px;
  }
}
.cvvInfo {
  position: absolute;
  top: 20px;

  @include if-ltr {
    right: 0;
  }

  @include if-rtl {
    left: 0;
  }
}
.remember {
  padding: 18px 0;
}
.rememberInfo {
  margin: 0 6px;
}
</style>
