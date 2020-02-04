<template>
<div :class="[$style.formSectionBankCard]">
  <FormSectionSavedCards
    v-if="innerValue.cardDataType === 'saved'"
    :cards="cards"
    v-model="innerValue.savedCardId"
    @remove="$emit('removeCard', $event)"
    @select="emitChanges('savedCardId')"
  />
  <template v-if="innerValue.cardDataType === 'manual'">
    <UiCardField
      v-model="innerValue.cardNumber"
      ref="cardNumberField"
      name="pan"
      autocomplete="cc-number"
      type="tel"
      tabindex="2"
      :class="[$style.formItem, { [$style._oneLine]: isOneLine }]"
      :hasError="$isFieldInvalid('innerValue.cardNumber')"
      :errorText="$t('FormSectionBankCard.cardNumberInvalid')"
      @keyup.native="moveFocusToFieldOnComplete('cardNumber', 16, 'expiryDateField')"
      @input="emitChanges('cardNumber')"
    />
    <div :class="[$style.formItem, { [$style._oneLine]: isOneLine }]">
      <UiTextField
        v-model="innerExpiryDate"
        id="expdate"
        name="cc-exp"
        autocomplete="cc-exp"
        label="expiration date"
        :class="$style.hiddenExpiry"
        @input="prepareExpiryDate"
      />
      <UiTextField
        v-model="innerValue.expiryDate"
        ref="expiryDateField"
        mask="##/##"
        type="tel"
        tabindex="3"
        autocomplete="off"
        :class="$style.expiry"
        :hasError="$isFieldInvalid('innerValue.expiryDate')"
        :errorText="$t('FormSectionBankCard.expiryDateInvalid')"
        :label="$t('FormSectionBankCard.expiryDate')"
        @keyup.native="moveFocusToFieldOnComplete('expiryDate', 4, 'cvvField')"
        @keyup.native.delete="moveFocusBackOnEmpty('expiryDate', 'cardNumberField')"
        @input="emitChanges('expiryDate')"
      />
      <UiCvvField
        v-model="innerValue.cvv"
        ref="cvvField"
        tabindex="4"
        :hasError="$isFieldInvalid('innerValue.cvv')"
        @keyup.native.delete="moveFocusBackOnEmpty('cvv', 'expiryDateField')"
        @input="emitChanges('cvv')"
      />
    </div>
  </template>

  <SavedCardToPlainFieldsSwitch
    v-if="cards.length"
    v-model="innerValue.cardDataType"
    @change="focusCardNumberField"
  />

  <UiTextField
    v-if="isEmailFieldExposed"
    v-model="innerValue.email"
    ref="emailField"
    name="email"
    type="email"
    tabindex="5"
    :class="$style.formItem"
    :hasError="$isFieldInvalid('innerValue.email')"
    :errorText="$t('FormSectionBankCard.emailInvalid')"
    :label="$t('FormSectionBankCard.email')"
    @input="emitChanges('email')"
  />
  <UiSelect
    v-if="isCountryFieldExposed"
    v-model="innerValue.country"
    maxHeight="240px"
    :options="countries"
    :placeholderLabel="$t('FormSectionBankCard.country')"
    :hasReversible="true"
    :hasError="$isFieldInvalid('innerValue.country')"
    :errorText="$t('FormSectionBankCard.countryInvalid')"
    tabindex="6"
    @input="emitChanges('country')"
  />
  <!-- <UiTextField
    v-model="innerValue.city"
    name="city"
    :class="$style.formItem"
    :label="$t('FormSectionBankCard.city')"
    :hasError="$isFieldInvalid('innerValue.city')"
    :errorText="$t('FormSectionBankCard.cityInvalid')"
    tabindex="7"
  /> -->
  <UiTextField
    v-if="isZipFieldExposed"
    v-model="innerValue.zip"
    name="zip"
    :class="$style.formItem"
    :label="$t('FormSectionBankCard.zip')"
    :hasError="$isFieldInvalid('innerValue.zip')"
    :errorText="$t('FormSectionBankCard.zipInvalid')"
    tabindex="8"
    @input="emitChanges('zip')"
  />

  <div
    v-if="innerValue.cardDataType === 'manual'"
    :class="[$style.formItem, $style.remember]"
  >
    <UiCheckbox
      v-model="innerValue.hasRemembered"
      tabindex="9"
      @input="emitChanges('hasRemembered')"
    >
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
          <div v-html="$t('FormSectionBankCard.rememberInfo')"></div>
        </UiTip>
      </div>
    </UiCheckbox>
  </div>
</div>
</template>

<script>
import {
  email,
  required,
  maxLength,
  minLength,
} from 'vuelidate/lib/validators';
import { toInteger, extend } from 'lodash-es';
import { gtagEvent } from '@/analytics';
import FormSectionSavedCards from '@/components/FormSectionSavedCards.vue';
import SavedCardToPlainFieldsSwitch from '@/components/SavedCardToPlainFieldsSwitch.vue';

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

  components: {
    FormSectionSavedCards,
    SavedCardToPlainFieldsSwitch,
  },

  props: {
    cardNumberValidator: {
      required: true,
      type: RegExp,
    },
    /**
     * @typedef {{ cardNumber: string, expiryDate: string }} Card
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
    isEmailFieldExposed: {
      type: Boolean,
      required: true,
    },
    isCountryFieldExposed: {
      type: Boolean,
      required: true,
    },
    isZipFieldExposed: {
      type: Boolean,
      required: true,
    },
    isZipInvalid: {
      type: Boolean,
      required: true,
    },
    isOneLine: {
      type: Boolean,
      default: false,
    },
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  data() {
    return {
      innerValue: extend({}, this.value),
      isCvvInfoShown: false,
      isRememberInfoShown: false,
      innerExpiryDate: '',
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
    let innerValue = {
      email: {
        required,
        email,
      },
    };
    if (this.innerValue.cardDataType === 'saved') {
      innerValue = {
        ...innerValue,
        savedCardId: {
          required,
        },
      };
    }
    if (this.innerValue.cardDataType === 'manual') {
      innerValue = {
        ...innerValue,
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
          maxLength: maxLength(4),
        },
      };
    }

    if (this.isCountryFieldExposed) {
      innerValue = {
        ...innerValue,
        country: {
          required,
        },
      };
    }
    if (this.isZipFieldExposed) {
      innerValue = {
        ...innerValue,
        zip: {
          required,
          wrongValue() {
            return !this.isZipInvalid;
          },
        },
      };
    }
    return {
      innerValue,
    };
  },

  mounted() {
    this.focusCardNumberField();
  },

  methods: {
    focusCardNumberField() {
      this.$nextTick(() => {
        if (this.$refs.cardNumberField) {
          this.$refs.cardNumberField.focus();
        }
      });
    },
    prepareExpiryDate() {
      const expiryLength = this.innerExpiryDate.length;
      const month = this.innerExpiryDate.substring(0, 2);
      const year = expiryLength === 7
        ? this.innerExpiryDate.substring(5)
        : this.innerExpiryDate.substring(3);
      this.innerValue.expiryDate = `${month}/${year}`;
      this.emitChanges('expiryDate');
    },
    moveFocusToFieldOnComplete(fieldValueName, length, nextField) {
      if (this.innerValue[fieldValueName].length === length) {
        this.$refs[nextField].focus();
      }
    },
    moveFocusBackOnEmpty(fieldValueName, prevField) {
      if (this.$refs[prevField] && this.innerValue[fieldValueName].length === 0) {
        this.$refs[prevField].focus();
      }
    },
    emitChanges(key) {
      // For v-model
      this.$emit('change', this.innerValue);

      const value = this.innerValue[key];
      // to watch certain field
      this.$emit(`${key}Change`, value);

      if (key === 'hasRemembered' && value) {
        gtagEvent('clickRememberCard', { event_category: 'userAction' });
      }
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
  justify-content: space-between;
}
.formItem {
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;

  &._oneLine {
    width: calc(50% - 10px);
  }
}
.expiry {
  @include if-ltr {
    margin-right: 20px;
  }
}
.hiddenExpiry {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  pointer-events: none;
  width: calc(50% - 10px);

  @include if-rtl {
    left: auto;
    right: 0;
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
