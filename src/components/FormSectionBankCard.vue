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
      <div
        :class="$style.cvvInfo"
        @mouseenter="isCvvInfoShown = true"
        @mouseleave="isCvvInfoShown = false"
      >
        <IconInfo />
        <UiTip
          innerPosition="right"
          section="form"
          :class="$style.cvvTip"
          :visible="isCvvInfoShown"
        >
          <div :class="$style.cvvContainer">
            <IconCvvCard :class="$style.cvvIconCard" />
            <div v-html="$t('FormSectionBankCard.cvvInfo')" />
          </div>
        </UiTip>
      </div>
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
  <template v-if="isGeoFieldsVisible">
    <UiSelect
      maxHeight="240px"
      v-model="innerValue.country"
      :options="countries"
      :placeholderLabel="$t('FormSectionBankCard.country')"
      :hasReversible="true"
    />
    <template v-if="innerValue.country === 'US'">
      <UiTextField
        v-model="innerValue.city"
        name="city"
        :class="$style.formItem"
        :label="$t('FormSectionBankCard.city')"
      />
      <UiTextField
        v-model="innerValue.zip"
        name="zip"
        :class="$style.formItem"
        :label="$t('FormSectionBankCard.zip')"
      />
    </template>
  </template>

  <div
    v-if="!hasCardsInStorage || anotherCard"
    :class="[$style.formItem, $style.remember]"
  >
    <UiCheckbox v-model="innerValue.hasRemembered">
      {{ $t('FormSectionBankCard.remember') }}
      <div
        :class="$style.rememberInfo"
        @mouseenter="isRememberInfoShown = true"
        @mouseleave="isRememberInfoShown = false"
      >
        <IconInfo />
        <UiTip
          innerPosition="center"
          section="form"
          width="220px"
          :visible="isRememberInfoShown"
        >
          {{ $t('FormSectionBankCard.rememberInfo') }}
        </UiTip>
      </div>
    </UiCheckbox>
  </div>
</div>
</template>

<script>
import { email, required, minLength } from 'vuelidate/lib/validators';
import { toInteger, extend, forEach } from 'lodash-es';

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
    countries: {
      type: Array,
      required: true,
    },
    isGeoFieldsVisible: {
      type: Boolean,
      required: true,
    },
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  data() {
    return {
      innerValue: extend({}, this.value),
      anotherCard: false,
      isCvvInfoShown: false,
      isRememberInfoShown: false,
    };
  },

  watch: {
    value: {
      handler(value) {
        extend(this.innerValue, value);
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

  created() {
    this.emitOnInnerValueChanges();
  },

  methods: {
    emitOnInnerValueChanges() {
      forEach(this.innerValue, (a, key) => {
        this.$watch(`innerValue.${key}`, (value) => {
          // For v-model
          this.$emit('change', this.innerValue);

          // to watch certain field
          this.$emit(`${key}Change`, value);
        });
      });
    },
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
  display: flex;
  top: 20px;
  cursor: pointer;

  @include if-ltr {
    right: 0;
  }

  @include if-rtl {
    left: 0;
  }
}
.cvvTip {
  @include if-ltr {
    margin-right: -20px;
  }

  @include if-rtl {
    margin-left: -20px;
  }
}
.cvvContainer {
  display: flex;
  padding: 8px 5px;
  width: 250px;
  justify-content: flex-start;
  align-items: center;
}
.cvvIconCard {
  @include if-ltr {
    margin-right: 10px;
  }

  @include if-rtl {
    margin-left: 10px;
  }
}
.remember {
  padding: 18px 0;
}
.rememberInfo {
  position: relative;
  display: inline-flex;
  cursor: pointer;
  margin: 0 6px;
}
</style>
