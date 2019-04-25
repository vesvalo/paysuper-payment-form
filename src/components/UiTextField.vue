<template>
<div class="text-field">
  <input
    v-bind="{ required, disabled }"
    :class="inputClasses"
    :value="value"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
    @input="$emit('input', $event.target.value)"
  >
  <label
    class="label"
    :title="label"
  >
    {{ label }}
  </label>
  <span
    v-if="isVisibleError"
    class="error"
    :title="errorText"
  >
    {{ errorText }}
  </span>
</div>
</template>

<script>
import { includes } from 'lodash-es';

export default {
  model: {
    prop: 'value',
    event: 'input'
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
    label: {
      default: '',
      type: String,
    },
    required: {
      default: false,
      type: Boolean,
    },
    type: {
      default: 'text',
      type: String,
      validator(val) {
        return includes(['text', 'email', 'card'], val);
      },
    },
    value: {
      default: '',
      type: [String, Number],
    },
  },
  computed: {
    isEmpty() {
      return !this.value && this.value !== 0;
    },
    /**
     * Error is visible if it exists and error text isn't empty
     * @return {boolean}
     */
    isVisibleError() {
      return !!(this.hasError && this.errorText);
    },
    /**
     * Classes for input
     * @return {Array<string>}
     */
    inputClasses() {
      return [
        'input',
        `_${this.type}`,
        this.isEmpty ? '_empty' : '',
        this.isVisibleError ? '_error' : '',
        this.disabled ? '_disabled' : '',
        this.required ? '_required' : '',
      ];
    },
  },
};
</script>

<style scoped lang="scss">
$background-color: transparent;
$primary-color: #fff;
$label-color: rgba(#fff, 0.5);
$border-color: rgba(#fff, 0.2);
$focus-border-color: #06eaa7;
$error-color: #fc7e57;

$primary-size: 15px;
$secondary-size: 12px;

.text-field {
  display: inline-block;
  padding: 18px 0 15px;
  position: relative;
  width: 100%;
  font-family: sans-serif;
  font-style: normal;
  font-weight: 500;
}

@mixin input() {
  background-color: $background-color;
  border-width: 0;
  border-bottom-width: 1px;
  border-color: $border-color;
  box-sizing: border-box;
  color: $primary-color;
  display: block;
  font-family: sans-serif;
  font-size: $primary-size;
  height: 24px;
  line-height: 24px;
  outline: none;
  padding: 0;
  transition: border-color 0.2s ease-out;
  width: 100%;

  &:hover {
    border-color: scale-color($border-color, $alpha: 37.5%);
  }

  &:focus {
    border-color: $focus-border-color;
  }

  &:focus ~ .label,
  &:not(:focus):not(._empty) ~ .label {
    width: 50%;
    transform: translateY(-18px) scale(0.75, 0.75);
  }
  &:focus ~ .label {
    pointer-events: auto;
    color: scale-color($label-color, $alpha: -40%);
  }
  &:not(:focus):not(._empty) ~ .label {
    color: scale-color($label-color, $alpha: -40%);
  }

  &._error {
    border-color: $error-color;
  }

  &._disabled {
    color: scale-color($label-color, $alpha: -50%);
    border-color: scale-color($border-color, $alpha: -50%);
    pointer-events: none;

    & ~ .label {
      color: scale-color($label-color, $alpha: -50%);
    }
  }
}
.input {
  @include input(); 
}
.label {
  color: $label-color;
  line-height: 24px;
  margin: 0;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: $primary-size;
  left: 0;
  pointer-events: none;
  top: 18px;
  transform-origin: left;
  transition: transform 0.2s ease-out, color 0.2s linear, width 0.1s ease-out;
  width: 100%;

  &:after {
    color: #f00;
  }
}
.error {
  bottom: 0;
  color: $error-color;
  display: block;
  font-size: $secondary-size;
  position: absolute;
  text-align: right;
  line-height: 15px;
  width: 100%;
}
</style>
