<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { email, required } from 'vuelidate/lib/validators';
import { includes, get } from 'lodash-es';
import FormSectionBankCard from './FormSectionBankCard.vue';
import ActionResult from '@/components/ActionResult.vue';
import PaymentAreaWarning from '@/components/PaymentAreaWarning.vue';

function getRegexp(value) {
  return new RegExp(value);
}

export default {
  name: 'FormSection',
  components: {
    FormSectionBankCard,
    ActionResult,
    PaymentAreaWarning,
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

      newUserCountry: '',
      isBankCardNumberValidating: false,
      validatedBankCardNumberPart: '',
    };
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderData',
      'activePaymentMethodId',
      'cards',
      'actionResult',
      'isUserLocationCheckRequested',
      'isUserLocationRestricted',
      'userCountry',
    ]),
    ...mapGetters('PaymentForm', ['activePaymentMethod']),
    ...mapGetters('Dictionaries', ['countries']),

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

    isPaymentFormVisible() {
      if (this.actionResult || this.isUserLocationCheckRequested || this.isUserLocationRestricted) {
        return false;
      }

      return true;
    },
  },

  watch: {
    'bankCardValue.cardNumber': async function watchCardNumber(value) {
      if (
        value.length >= 6
        && (
          !this.validatedBankCardNumberPart
          || value.indexOf(this.validatedBankCardNumberPart) === -1
        )
      ) {
        this.isBankCardNumberValidating = true;

        try {
          await this.checkPaymentAccount(value);
          this.validatedBankCardNumberPart = value;
        } catch (error) {
          console.error(error);
        }
        this.isBankCardNumberValidating = false;
      }
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
        email: {
          required,
          email,
        },
      },
    };
  },

  created() {
    this.bankCardValue.email = this.orderData.email;
    this.ewalletValue.email = this.orderData.email;
  },

  methods: {
    ...mapActions('PaymentForm', [
      'setActivePaymentMethodById',
      'createPayment',
      'clearActionResult',
      'usePaymentApi',
      'removeCard',
      'checkPaymentAccount',
      'updateUserCountry',
      'updateBillingData',
      'checkUserCountry',
      'setPaymentLoading',
      'setFormLoading',
    ]),

    handleMainButtonClick() {
      if (this.isUserLocationCheckRequested) {
        this.submitUserCountry();
      }

      if (this.isUserLocationRestricted) {
        this.$emit('close');
      }

      if (this.isPaymentFormVisible) {
        this.submitPaymentForm();
      }
    },

    async submitUserCountry() {
      this.updateUserCountry(this.newUserCountry);
      this.setFormLoading(true);
      await this.checkUserCountry();
      this.setFormLoading(false);
    },

    async submitPaymentForm() {
      this.clearActionResult();
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

      this.setPaymentLoading(true);
      this.createPayment({
        ...this.bankCardValue,
        ewallet: this.ewalletValue.number,
        email: this.isBankCardPayment ? this.bankCardValue.email : this.ewalletValue.email,
      });
      this.setPaymentLoading(false);
    },

    updateScrollbar() {
      this.$refs.scrollbar.update();
    },
  },
};
</script>

<template>
<div :class="[$style.formSection, $style[`_layout-${layout}`]]">
  <div :class="$style.content">
    <component
      ref="scrollbar"
      :is="layout === 'modal' ? 'UiScrollbarBox' : 'div'"
      :class="$style.scrollbox"
      :settings="layout === 'modal' ? {suppressScrollX: true} : undefined"
    >
      <div
        v-show="isPaymentFormVisible"
        :class="$style.contentInner"
      >
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
          :country="userCountry"
          :countries="countries"
          :cards="cards"
          :cardNumberValidator="activePaymentMethod.account_regexp | getRegexp"
          @updateScrollbar="updateScrollbar"
          @removeCard="removeCard"
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
            v-model="ewalletValue.email"
            type="email"
            name="ewalletValue.email"
            :hasError="$isFieldInvalid('ewalletValue.email')"
            :errorText="$t('FormSection.emailInvalid')"
            :label="$t('FormSection.email')"
          />
        </template>
      </div>
      <div
        :class="$style.contentInner"
        v-if="!isPaymentFormVisible"
      >
        <ActionResult
          v-if="actionResult"
          :type="actionResult.type"
          :message="actionResult.message"
        />
        <PaymentAreaWarning
          v-if="isUserLocationCheckRequested || isUserLocationRestricted"
          :country="userCountry"
          :countries="countries"
          :content="isUserLocationRestricted ? 'restricted' : 'select-location'"
          @updateScrollbar="updateScrollbar"
          @changeCountry="newUserCountry = $event"
        />
      </div>
    </component>
  </div>
  <div :class="$style.footer">
    <UiButton
      :class="$style.payBtn"
      :hasBorderRadius="layout === 'page' ? true : false"
      @click="handleMainButtonClick"
    >
      <template v-if="isPaymentFormVisible">
        <IconLock slot="before" />
        <span>
          {{ $t('FormSection.payButtonPrefix') }}
        </span>
        <span>
          {{ orderData.total_amount.toFixed(2) }} {{ orderData.currency }}
        </span>
      </template>
      <template v-if="actionResult">
        {{ $t('FormSection.tryAgain') }}
      </template>
      <template v-if="isUserLocationCheckRequested">
        {{$t('FormSection.save')}}
      </template>
      <template v-if="isUserLocationRestricted">
        {{$t('FormSection.ok')}}
      </template>
    </UiButton>
  </div>
</div>
</template>

<style module lang="scss">
.formSection {
  display: flex;
  flex-wrap: nowrap;
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
  max-height: calc(100% - 70px);
}

.scrollbox {
  width: 100%;
  height: 100%;
  flex-grow: 1;
}

.contentInner {
  width: 100%;
  height: 100%;
  flex-grow: 1;

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
