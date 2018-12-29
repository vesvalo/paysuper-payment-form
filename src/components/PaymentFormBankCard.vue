<template>
  <div class="payment-form-bank-card">
    <div class="payment-form-bank-card__inner">
      <div class="payment-form-bank-card__row">
        <BaseTextField
          v-model="innerValue.cardNumber"
          :hasError="$isFieldInvalid('innerValue.cardNumber')"
          :errors="$getFieldErrorMessages('innerValue.cardNumber')"
          :placeholder="$t('placeholders.cardNumber')"
          mask="#### #### #### ####"
          autocomplete="off"
          name="pan"
        />
      </div>

      <div class="payment-form-bank-card__row">
        <div class="payment-form-bank-card-expire">
          <div class="payment-form-bank-card-expire__item">
            <BaseTextField
              v-model="innerValue.month"
              :hasError="$isFieldInvalid('innerValue.month')"
              :errors="$getFieldErrorMessages('innerValue.month')"
              mask="##"
              name="month"
              placeholder="MM"
              maxlength="2"
              @input="jumpToYearOnComplete"
            />
          </div>
          <div class="payment-form-bank-card-expire__delimiter">/</div>
          <div class="payment-form-bank-card-expire__item">
            <BaseTextField
              v-model="innerValue.year"
              :hasError="$isFieldInvalid('innerValue.year')"
              :errors="$getFieldErrorMessages('innerValue.year')"
              ref="yearField"
              mask="##"
              name="year"
              placeholder="YY"
              maxlength="2"
            />
          </div>
        </div>
        <div class="payment-form-bank-card__cvv">
          <BaseTextField
            v-model="innerValue.cvv"
            :hasError="$isFieldInvalid('innerValue.cvv')"
            :errors="$getFieldErrorMessages('innerValue.cvv')"
            mask="###"
            type="password"
            name="cvv"
            placeholder="CVV"
            maxlength="3"
          />
        </div>
      </div>

      <div class="payment-form-bank-card__row">
        <BaseTextField
          v-model="innerValue.cardHolder"
          :hasError="$isFieldInvalid('innerValue.cardHolder')"
          :errors="$getFieldErrorMessages('innerValue.cardHolder')"
          :placeholder="$t('placeholders.cardHolder')"
          name="card_holder"
          mask="UUUUUUUUUUUUUUUUUUUUUUU"
          maxlength="23"
        />
      </div>
    </div>
    <div class="payment-form-bank-card-approves">
      <img width="240" height="32" src="@/assets/images/bankCardApproves.png" alt="">
    </div>
  </div>
</template>

<script>
import { has, extend } from 'lodash-es';
import { required, between, minLength } from 'vuelidate/lib/validators';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },

  name: 'PaymentFormBankCard',

  props: {
    value: {
      required: true,
      type: Object,
      validator(value) {
        return (
          has(value, 'cardNumber')
          && has(value, 'month')
          && has(value, 'year')
          && has(value, 'cvv')
          && has(value, 'cardHolder')
        );
      },
    },
    cardNumberValidator: {
      required: true,
      type: RegExp,
    },
  },

  data() {
    return {
      innerValue: extend({}, this.value),
    };
  },

  validations: {
    innerValue: {
      cardNumber: {
        wrongFormatType(value) {
          return this.cardNumberValidator.test(value);
        },
      },
      month: {
        required,
        between: between(1, 12),
      },
      year: {
        required,
      },
      cvv: {
        required,
        minLength: minLength(3),
      },
      cardHolder: {
        required,
      },
    },
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

  methods: {
    validate() {
      this.$v.$touch();
      return {
        isValid: !this.$v.$invalid,
      };
    },

    jumpToYearOnComplete() {
      if (this.innerValue.month.length === 2) {
        this.$refs.yearField.focus();
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/gui.scss";

.payment-form-bank-card {
  width: 320px;

  &__inner {
    padding: 20px;
    border: 1px solid $ui-color-grey87;
    background: $ui-color-grey96;
  }

  &__row {
    display: flex;
    justify-content: space-between;

    & + & {
      margin-top: 10px;
    }
  }

  &__cvv {
    width: 30%;
  }
}

.payment-form-bank-card-expire {
  width: 50%;
  display: flex;

  &__item {
    width: 30%;
    flex-basis: 0;
    flex-grow: 1;
  }

  &__delimiter {
    width: 12px;
    text-align: center;
    height: 34px;
    line-height: 34px;
  }
}

.payment-form-bank-card-approves {
  text-align: right;
  padding-top: 5px;
}
</style>


<i18n>
{
  "en": {
    "placeholders": {
      "cardNumber": "Card number",
      "cardHolder": "Card holder"
    }
  },
  "ru": {
    "placeholders": {
      "cardNumber": "Номер карты",
      "cardHolder": "Владелец карты"
    }
  }
}
</i18n>
