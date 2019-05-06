<template>
<label
  :class="['base-checkbox', { '_disabled': disabled }]"
  :for="id"
>
  <input
    v-bind="{ checked, disabled, id }"
    class="input"
    type="checkbox"
    @change="emitChange"
  >

  <div :class="checkboxClasses">
    <svg viewBox="0 0 52 52">
      <path
        d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M40.495,
        17.329l-16,18 C24.101,35.772,23.552,36,22.999,36c-0.439,
        0-0.88-0.144-1.249-0.438l-10-8c-0.862-0.689-1.002-1.948-0.312-2.811 c0.689-0.863,
        1.949-1.003,2.811-0.313l8.517,6.813l14.739-16.581c0.732-0.826,1.998-0.9,2.823-0.166 C41.154,
        15.239,41.229,16.503,40.495,17.329z"
      />
    </svg>
  </div>

  <span class="label-text">
    <slot/>
  </span>
</label>
</template>

<script>
import { includes, uniqueId } from 'lodash-es';

export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: {
      default: false,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    size: {
      default: 'default',
      type: String,
      validator(value) {
        return includes(['default'], value);
      },
    },
  },
  computed: {
    /**
     * Classes for checkbox
     * @return {Array<string>}
     */
    checkboxClasses() {
      return ['check', `_${this.size}`, this.disabled ? '_disabled' : ''];
    },
    /**
     * Unique ID for checkbox element
     * @return {string}
     */
    id() {
      return uniqueId('checkbox');
    },
  },
  methods: {
    /**
     * @param {Event} event
     */
    emitChange(event) {
      // If button has disabled we shoudn't send events
      if (this.disabled) {
        return;
      }

      this.$emit('input', event.target.checked);
    },
  },
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400|Quicksand&subset=cyrillic,cyrillic-ext');

$common-font-family: 'Quicksand', 'Comfortaa', sans-serif;
$box-color: transparent;
$disabled-color: rgba(#fff, 0.5);
$border-color: #fff;
$hover-check-color: #06eaa7;
$text-color: #fff;
$hover-text-color: #06eaa7;
$label-margin: 10px;

.base-checkbox {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-family: $common-font-family;
  cursor: pointer;

  &:hover:not(._disabled) {
    .label-text {
      color: $hover-text-color;
    }

    .check {
      border-color: $hover-check-color;
    }
  }

  &._disabled {
    .label-text {
      color: $disabled-color;
    }
  }
}
.input {
  height: 0;
  position: absolute;
  visibility: hidden;
  width: 0;

  &:checked + .check {
    border-width: 0px;
  }
  &:checked + .check > svg > path {
    fill: $hover-check-color;
  }
}
.check {
  border-radius: 50%;
  border: 1px solid $border-color;
  background-color: $box-color;
  box-sizing: border-box;
  height: 20px;
  width: 20px;

  & > svg {
    pointer-events: none;

    & > path {
      fill: none;
      transition: all 0.2s ease-out;
    }
  }

  &._disabled {
    background-color: $disabled-color;
    border-color: $disabled-color;
  }
}
.label-text {
  margin-left: $label-margin;
  color: $text-color;

  &:empty {
    display: none;
  }
}
</style>
