<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { email, required } from 'vuelidate/lib/validators';
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
      bankCardValue: {
        email: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: '',
        hasRemembered: false,
      },

      ewalletValue: {
        email: '',
        number: '',
      },

      paymentMethodOptions: {
        BANKCARD: {
          label: this.$t('FormSection.card'),
          iconComponent: 'IconCard',
        },
        NETELLER: {
          label: this.$t('FormSection.neteller'),
          iconComponent: 'IconCard',
        },
        ALIPAY: {
          label: this.$t('FormSection.alipay'),
          iconComponent: 'IconCard',
          types: {
            ewallet: {
              iconComponent: 'IconCard',
            },
          },
        },
        BITCOIN: {
          label: this.$t('FormSection.bitcoin'),
          iconComponent: 'IconCard',
        },
        QIWI: {
          label: this.$t('FormSection.qiwi'),
          iconComponent: 'IconQiwi',
        },
        WEBMONEY: {
          label: this.$t('FormSection.webmoney'),
          iconComponent: 'IconWebmoney',
        },
      },
    };
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderData',
      'initialEmail',
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

  validations() {
    if (this.isBankCardPayment) {
      return {};
    }

    return {
      ewalletValue: {
        number: {
          required,
          wrongFormatType(value) {
            if (!this.activePaymentMethod.account_regexp) {
              return true;
            }
            return getRegexp(this.activePaymentMethod.account_regexp).test(value);
          },
        },
        ...(
          !this.initialEmail
            ? { email: { required, email } }
            : {}
        ),
      },
    };
  },

  methods: {
    ...mapActions('PaymentForm', [
      'setActivePaymentMethodById', 'createPayment', 'hidePaymentError', 'usePaymentApi',
    ]),

    submitPaymentForm() {
      this.hidePaymentError();
      this.$v.$touch();

      const isValidArray = [
        !this.$v.$invalid,
      ];

      if (this.isBankCardPayment) {
        const { isValid } = this.$refs.bankCardForm.validate();
        isValidArray.push(isValid);
      }

      if (isValidArray.filter(item => !item).length) {
        // has errors
        return;
      }

      this.createPayment({
        ...this.bankCardValue,
        ewallet: this.ewalletValue.number,
        email: this.initialEmail || (
          this.isBankCardPayment ? this.bankCardValue.email : this.ewalletValue.email
        ),
      });
    },
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
          :prependLabel="$t('FormSection.prependLabel')"
          @input="setActivePaymentMethodById"
        />

        <FormSectionBankCard
          v-if="isBankCardPayment"
          ref="bankCardForm"
          v-model="bankCardValue"
          :cardNumberValidator="activePaymentMethod.account_regexp | getRegexp"
          :initialEmail="initialEmail"
        />
        <template v-else>
          <UiTextField
            :class="$style.formItem"
            v-model="ewalletValue.number"
            name="ewallet"
            :hasError="$isFieldInvalid('ewalletValue.number')"
            :errorText="$t('FormSection.ewalletNumberError')"
            :label="$t('FormSection.placeholderEwallet', {name: activePaymentMethod.name})"
          />
          <UiTextField
            :class="$style.formItem"
            v-if="!initialEmail"
            v-model="ewalletValue.email"
            type="email"
            name="ewalletValue.email"
            :hasError="$isFieldInvalid('ewalletValue.email')"
            :errorText="$t('FormSection.emailInvalid')"
            :label="$t('FormSection.email')"
          />
        </template>
      </div>
    </UiScrollbarBox>
  </div>
  <div :class="$style.footer">
    <UiButton
      :class="$style.payBtn"
      :hasBorderRadius="layout === 'page' ? true : false"
      @click="submitPaymentForm"
    >
      <IconLock slot="before" />
      {{$t('FormSection.payButtonPrefix')}}
      {{orderData.total_amount.toFixed(2)}} {{orderData.currency}}
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
