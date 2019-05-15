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
    <IconCheck v-if="checked" />
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
      return [ 'check', `_${this.size}`, { '_disabled': this.disabled } ];
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
$disabled-opacity: 0.5;
$disabled-color: rgba(#fff, $disabled-opacity);
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
  vertical-align: top;
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
    pointer-events: none;

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
}
.check {
  border-radius: 50%;
  border: 1px solid $border-color;
  background-color: $box-color;
  box-sizing: border-box;
  height: 20px;
  width: 20px;

  &._disabled {
    opacity: $disabled-opacity;
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
