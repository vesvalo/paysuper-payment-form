<template>
<div :class="$style.container">
  <UiTextField
    v-model="innerValue"
    v-bind="{ required, disabled, errorText, hasError }"
    mask="#### #### #### ####"
    :label="$t('cardNumber')"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
    @input="cardChange"
  />
  <IconMastercard :class="$style.mastercard" />
</div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    errorText: {
      default: '',
      type: String,
    },
    hasError: {
      default: false,
      type: Boolean,
    },
    required: {
      default: false,
      type: Boolean,
    },
    value: {
      default: '',
      type: [String, Number],
    },
  },
  data() {
    return {
      innerValue: this.value,
    };
  },
  computed: {},
  methods: {
    cardChange(value) {
      this.$emit('input', value);
    },
  },
  watch: {
    value(value) {
      this.innerValue = value;
    },
  },
};
</script>

<style module lang="scss">
.container {
  position: relative;
  width: 100%;
}
.mastercard {
  position: absolute;
  right: 0;
  top: 21px;
}
</style>

<i18n>
{
  "en": {
    "cardNumber": "Card number"
  },
  "ru": {
    "cardNumber": "Номер карты"
  }
}
</i18n>
