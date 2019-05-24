<template>
<div
  v-clickaway="blur"
  :class="selectClasses"
  @click="focused ? blur() : focus()"
>
  <input
    :class="$style.selected"
    :value="selectedLabel"
    :readonly="true"
  />
  <div :class="$style.box">
    <div :class="$style.options">
      <slot name="options" :selectId="selectId" />
    </div>
  </div>
</div>
</template>

<script>
import { directive as clickaway } from 'vue-clickaway';
import { find, get, uniqueId } from 'lodash-es';

export default {
  directives: {
    clickaway,
  },
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    options: {
      default: () => [],
      type: Array,
      validator(value) {
        if (!value.length) {
          return true;
        }
        if (value[0].label !== undefined && value[0].value !== undefined) {
          return true;
        }
        return false;
      },
    },
    value: {
      default: '',
      type: [String, Number],
    },
  },
  data() {
    return {
      focused: false,
      selectValue: this.value || get(this.options, '0.value', ''),
    };
  },
  computed: {
    selectClasses() {
      return [
        this.$style.container,
        this.focused ? this.$style._focused : '',
        this.selectValue === '' ? this.$style._empty : '',
        this.disabled ? this.$style._disabled : '',
      ];
    },
    selectedLabel() {
      const selectedItem = find(this.options, { value: this.selectValue });
      return selectedItem ? selectedItem.label : '';
    },
    selectId() {
      return uniqueId('select');
    },
  },
  watch: {
    value(val) {
      this.selectValue = val;
    },
  },
  methods: {
    emitChange({ target: { value } }) {
      this.blur();
      this.$emit('input', value);
    },
    focus() {
      this.focused = true;
    },
    blur() {
      this.focused = false;
    },
  },
};
</script>

<style module lang="scss">
@import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400|Quicksand&subset=cyrillic,cyrillic-ext');

$font-family: 'Quicksand', 'Comfortaa', sans-serif;

$background-color: transparent;
$input-color: #fff;
$border-color: rgba(255, 255, 255, 0.2);
$focus-border-color: #06eaa7;
$hover-option-color: #06eaa7;
$disabled-opacity: 0.7;

$primary-input-size: 16px;
$secondary-input-size: 14px;

.container {
  background-color: $background-color;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-block;
  vertical-align: top;
  font-size: $primary-input-size;
  position: relative;
  width: 100%;

  &._disabled {
    opacity: $disabled-opacity;
    pointer-events: none;
  }
}
.selected {
  display: block;
  height: 24px;
  line-height: 24px;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  background-color: $background-color;
  border: none;
  border-bottom: 1px solid $border-color;
  pointer-events: none;
  outline: none;
  color: $input-color;
  font-family: $font-family;
}
.box {
  position: absolute;
  background-color: #424C66;
  left: -20px;
  z-index: 10;
  text-overflow: ellipsis;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.2s ease-out;
  white-space: nowrap;
  width: calc(100% + 40px);
  top: 24px;
}
.options {
  background-color: $background-color;
  max-height: 220px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.option {
  cursor: pointer;
  display: block;
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  margin: 0;

  &:hover,
  &._current {
    color: $hover-option-color;
  }
}
.input {
  height: 0;
  visibility: hidden;
  width: 0;
}
</style>
