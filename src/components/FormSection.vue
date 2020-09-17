<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { email, required } from 'vuelidate/lib/validators';
import {
  debounce,
  get,
  find,
  toLower,
} from 'lodash-es';
import { gtagEvent } from '@/analytics';
import ActionResult from '@/components/ActionResult.vue';
import FormSectionBankCard from '@/components/FormSectionBankCard.vue';
import PaymentAreaWarning from '@/components/PaymentAreaWarning.vue';
import geInstructionLinkByPlatform from '@/helpers/geInstructionLinkByPlatform';

function getRegexp(value) {
  return new RegExp(value);
}

export default {
  name: 'FormSection',

  components: {
    ActionResult,
    FormSectionBankCard,
    PaymentAreaWarning,
  },

  props: {
    isPageView: {
      type: Boolean,
      default: false,
    },
  },

  filters: {
    getRegexp,
  },

  data() {
    return {
      paymentMethodGroups: {
        BANKCARD: {
          iconComponent: 'IconCard',
        },
        NETELLER: {
          iconComponent: 'IconCard',
        },
        ALIPAY: {
          iconComponent: 'IconCard',
        },
        BITCOIN: {
          iconComponent: 'IconCard',
        },
        QIWI: {
          iconComponent: 'IconQiwi',
        },
        WEBMONEY: {
          iconComponent: 'IconWebmoney',
        },
      },
      paymentMethodTypes: {
        ewallet: {
          iconComponent: 'IconCard',
        },
      },
    };
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderData',
      'orderParams',
      'paymentData',
      'activePaymentMethodId',
      'cards',
      'actionResult',
      'isUserCountryConfirmRequested',
      'isUserCountryRestricted',
      'userIpGeoData',
      'isEmailFieldExposed',
      'isCountryFieldExposed',
      'isZipFieldExposed',
      'isZipInvalid',
      'currentPlatformId',
      // Todo: remove after #195691
      'hasExpAutofill',
    ]),
    ...mapGetters('PaymentForm', [
      'activePaymentMethod',
      'isPaymentFailed',
      'isPaymentSuccess',
    ]),
    ...mapGetters('PaymentForm/Redirect', [
      'isRedirect',
      'isAutoRedirect',
      'redirectDelay',
      'hasTimer',
      'redirectSuccessUrl',
      'redirectFailUrl',
    ]),
    ...mapGetters('Dictionaries', ['countries']),

    redirectButtonText() {
      return this.isRedirect
        ? get(this.orderData, 'project.redirect_settings.button_caption', '')
        : '';
    },

    paymentMethodsSelectList() {
      return this.orderData.payment_methods.map((item) => {
        const group = this.paymentMethodGroups[item.group_alias];
        const type = this.paymentMethodTypes[item.type];
        const i18nAlias = toLower(item.group_alias) || toLower(item.name);
        const hasI18nLabel = this.$i18n.te(`FormSection.${i18nAlias}`);
        const label = hasI18nLabel ? this.$i18n.t(`FormSection.${i18nAlias}`) : item.name;
        const config = {
          label,
          ...(type || {}),
          ...(group || {}),
        };

        return {
          value: item.id,
          label: get(config, 'label'),
          iconComponent: get(config, 'iconComponent'),
        };
      });
    },

    isBankCardPayment() {
      return this.activePaymentMethod.type === 'bank_card';
    },

    isPaymentFormVisible() {
      if (this.actionResult || this.isUserCountryConfirmRequested || this.isUserCountryRestricted) {
        return false;
      }

      return true;
    },

    isSubmitButtonDisabled() {
      // In some buggy cases countryConfirm might be requested while userIpGeoData is null
      const ipDataCountry = get(this.userIpGeoData, 'country', '');
      if (this.isUserCountryConfirmRequested && ipDataCountry === this.paymentData.country) {
        return true;
      }
      return false;
    },

    orderType() {
      return this.orderData.type;
    },

    platformInstructionLink() {
      return geInstructionLinkByPlatform(this.currentPlatformId);
    },
  },

  watch: {
    cards: {
      handler(value) {
        if (!value.length) {
          this.setPaymentData({ cardDataType: 'manual' });
        }
      },
      immediate: true,
    },
  },

  validations() {
    if (this.isBankCardPayment) {
      return {};
    }

    return {
      paymentData: {
        // ewallet or crypto
        [this.activePaymentMethod.type]: {
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

  methods: {
    ...mapActions('PaymentForm', [
      'setActivePaymentMethodById',
      'createPayment',
      'setPaymentData',
      'removeCard',
      'checkPaymentAccount',
      'submitUserCountry',
      'updateBillingData',
    ]),

    async handleMainButtonClick() {
      if (this.isUserCountryConfirmRequested) {
        gtagEvent('clickSaveUserCountry', { event_category: 'userAction' });
        await this.requestBillingDataUpdate();
        this.submitUserCountry();
        if (this.$refs.bankCardForm) {
          this.$refs.bankCardForm.focusCardNumberField();
        }
      } else if (this.isUserCountryRestricted) {
        gtagEvent('clickCloseButton', { event_category: 'userAction' });
        this.$emit('close');
      } else if (this.isPaymentFormVisible) {
        gtagEvent('clickPayButton', { event_category: 'userAction' });
        this.submitPaymentForm();
      } else if (this.isRedirect) {
        const eventName = this.isPaymentFailed ? 'clickCloseButton' : 'clickOkButton';
        const redirectUrl = this.isPaymentFailed ? this.redirectFailUrl : this.redirectSuccessUrl;

        gtagEvent(eventName, { event_category: 'userAction' });

        if (this.isAutoRedirect === false) {
          window.location.replace(redirectUrl);
        }
      } else {
        this.$emit('close');
      }
    },

    submitPaymentForm() {
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

      gtagEvent('submitPaymentForm');

      this.createPayment({
        ...this.paymentData,
      });
    },

    setNewUserCountry(value) {
      this.setPaymentData({ country: value, city: '', zip: '' });

      gtagEvent('setUserCountry', {
        event_category: 'userAction',
        country: value,
      });
    },

    async requestBillingDataUpdate() {
      await this.updateBillingData(this.paymentData);
    },

    async checkBankCardNumber(value) {
      // complete card number
      if (value.length === 16) {
        await this.checkPaymentAccount(value);
      }
    },

    async checkSavedCardNumberById(id) {
      const card = find(this.cards, { id });
      if (!card) {
        return;
      }
      await this.checkPaymentAccount(card.pan);
    },

    changePaymentData(value) {
      this.setPaymentData({ [this.activePaymentMethod.type]: value });
      if (this.activePaymentMethod.name === 'Qiwi' && value.length > 6 && value.length < 16) {
        this.handleInputValidPhone(value);
      }
    },

    handleInputValidPhone: debounce(async function validatePhone(value) {
      const preparedValue = value.replace(/\s/g, '');
      await this.checkPaymentAccount(preparedValue);
    }, 300),
  },
};
</script>

<template>
<form
  :class="[$style.formSection, { [$style[`_isPage`]]: isPageView }]"
  action=""
  @submit.prevent="handleMainButtonClick"
>
  <div :class="$style.content">
    <component
      :is="isPageView ? 'div' : 'UiScrollbarBox'"
      :class="$style.scrollbox"
      :settings="isPageView ? undefined : { suppressScrollX: true }"
    >
      <!--
        It's important not to render the form until the requested country is selected
        Otherwise rendering saved cards will cause buggy behavior
        (it's emitting "select" on created)
         -->
      <div
        v-if="isPaymentFormVisible"
        :class="$style.contentInner"
      >
        <UiSelect
          maxHeight="240px"
          :value="activePaymentMethodId"
          :class="$style.formItem"
          :options="paymentMethodsSelectList"
          :prependLabel="$t('FormSection.prependLabel')"
          tabindex="1"
          @input="setActivePaymentMethodById"
        />
        <FormSectionBankCard
          v-if="isBankCardPayment"
          ref="bankCardForm"
          :value="paymentData"
          :countries="countries"
          :cards="cards"
          :cardNumberValidator="activePaymentMethod.account_regexp | getRegexp"
          :isEmailFieldExposed="isEmailFieldExposed"
          :isCountryFieldExposed="isCountryFieldExposed"
          :isZipFieldExposed="isZipFieldExposed"
          :isZipInvalid="isZipInvalid"
          :hasExpAutofill="hasExpAutofill"
          @savedCardIdChange="checkSavedCardNumberById"
          @cardNumberChange="checkBankCardNumber"
          @countryChange="setNewUserCountry($event), requestBillingDataUpdate()"
          @cityChange="requestBillingDataUpdate"
          @zipChange="requestBillingDataUpdate"
          @removeCard="removeCard"
          @change="setPaymentData($event)"
        />
        <template v-else>
          <UiTextField
            :class="$style.formItem"
            :value="paymentData[activePaymentMethod.type]"
            :name="activePaymentMethod.type"
            :hasError="$isFieldInvalid(`paymentData.${activePaymentMethod.type}`)"
            :errorText="$t('FormSection.abstractNumberError')"
            :label="$t('FormSection.abstractNumberPlaceholder', { name: activePaymentMethod.name })"
            @input="changePaymentData($event)"
          />
          <UiTextField
            v-if="isEmailFieldExposed"
            :class="$style.formItem"
            :value="paymentData.email"
            type="email"
            name="email"
            :hasError="$isFieldInvalid('paymentData.email')"
            :errorText="$t('FormSection.emailInvalid')"
            :label="$t('FormSection.email')"
            @input="setPaymentData({ email: $event })"
          />
        </template>
      </div>
      <div
        :class="$style.contentInner"
        v-if="!isPaymentFormVisible"
      >
        <ActionResult
          v-if="actionResult"
          :email="paymentData.email"
          :code="actionResult.code"
          :orderId="orderData.id"
          :orderType="orderType"
          :type="actionResult.type"
          :platformInstructionLink="platformInstructionLink"
        />
        <PaymentAreaWarning
          v-if="isUserCountryConfirmRequested || isUserCountryRestricted"
          :countries="countries"
          :content="isUserCountryRestricted ? 'restricted' : 'select-location'"
          @changeCountry="setNewUserCountry"
        />
      </div>
    </component>
  </div>
  <div :class="$style.footer">
    <UiTimer
      v-if="hasTimer"
      minWidth="100px"
      :time="redirectDelay"
    >
      <IconTimer slot="prepend" />
      <span slot="append">{{ $t('FormSection.seconds') }}</span>
    </UiTimer>
    <UiButton
      v-else
      :class="$style.payBtn"
      :hasBorderRadius="isPageView"
      :disabled="isSubmitButtonDisabled"
      tabindex="10"
    >
      <template v-if="isPaymentFormVisible">
        <IconLock slot="before" />
        <span>
          {{ $t('FormSection.payButtonPrefix') }}
        </span>
        <span :title="$getPrice(orderData.charge_amount, orderData.charge_currency)">
          {{ $getPrice(orderData.charge_amount, orderData.charge_currency) }}
        </span>
      </template>
      <template v-if="isUserCountryConfirmRequested">
        {{ $t('FormSection.save') }}
      </template>
      <template v-if="isUserCountryRestricted">
        {{ $t('FormSection.close') }}
      </template>
      <template v-if="isPaymentFailed">
        {{ redirectButtonText || $t('FormSection.close') }}
      </template>
      <template v-if="isPaymentSuccess">
        {{ redirectButtonText || $t('FormSection.ok') }}
      </template>
    </UiButton>
  </div>
</form>
</template>

<style module lang="scss">
.formSection {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-content: space-between;
  position: relative;
  min-height: 454px;
  max-height: 100%;
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
  padding: 0 20px 20px;

  .formSection._isPage & {
    padding: 20px 0px 20px;

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
  justify-content: center;
  align-items: flex-end;
  width: 100%;

  .formSection._isPage &._sticky {
    left: 0 !important;
    width: 100vw !important;
  }
}
.payBtn {
  width: 100%;
  transition: border-radius 0.2s ease-out;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
