<template>
<div
  v-clickaway="blur"
  :class="selectClasses"
>
  <div
    :class="$style.wrapper"
    @click="focused ? blur() : focus()"
  >
    <div
      :class="[
        $style.selected,
        { [$style._focused]: focused },
        { [$style._nativeFocus]: hasNativeFocus }
      ]"
    >
      <div
        v-if="selectedItem && selectedItem.iconComponent"
        :class="[$style.icon, $style[`_${iconPosition}`]]"
      >
        <component :is="selectedItem.iconComponent" />
      </div>
      <input
        ref="input"
        :class="[$style.input, { [$style._focused]: focused }, { [$style._empty]: !selectValue }]"
        :value="label"
        :readonly="true"
        :tabindex="tabindex"
        @focus="hasNativeFocus = true"
        @blur="hasNativeFocus = false"
        @keydown.up="selectPrevItem"
        @keydown.down="selectNextItem"
      />
      <div :class="[$style.arrow, {
        [$style._focused]: focused,
        [$style._reverse]: hasReversible
      }]">
        <IconArrow />
      </div>
    </div>
    <span
      :class="[$style.error, { [$style._showed]: isVisibleError }]"
      :title="errorText"
    >
      {{ errorText }}
    </span>
    <div :class="[$style.box, { [$style._focused]: focused, [$style._reverse]: hasReversible }]">
      <UiScrollbarBox
        :class="$style.scrollbar"
        :settings="{ suppressScrollX: true, minScrollbarLength: 20 }"
        :style="{ maxHeight: maxHeight || undefined }"
      >
        <div :class="$style.options">
          <UiSelectOption
            v-for="option in actualOtions"
            :key="option.value"
            :isRemovable="isRemovable"
            :iconPosition="iconPosition"
            :option="option"
            :selectId="selectId"
            @input="selectOption"
            @remove="remove(option.value)"
          />
        </div>
        <slot name="additional"/>
      </UiScrollbarBox>
    </div>
  </div>
</div>
</template>

<script>
import { directive as clickaway } from 'vue-clickaway';
import {
  filter,
  find,
  findIndex,
  includes,
  uniqueId,
} from 'lodash-es';

export default {
  directives: {
    clickaway,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    appendLabel: {
      default: '',
      type: String,
    },
    isRemovable: {
      default: false,
      type: Boolean,
    },
    prependLabel: {
      default: '',
      type: String,
    },
    placeholderLabel: {
      default: 'Select a value',
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    hasReversible: {
      default: false,
      type: Boolean,
    },
    maxHeight: {
      default: '',
      type: String,
    },
    iconPosition: {
      default: 'left',
      type: String,
      validator(value) {
        return includes(['left', 'right'], value);
      },
    },
    /**
     * @typedef {{
     *  label: string,
     *  value: string,
     *  iconComponent?: string,
     *  additional?: string
     * }} Option
     * @type {Option[]}
     */
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
    isFocused: {
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
    tabindex: {
      default: undefined,
      type: [Number, String],
    },
  },
  data() {
    return {
      focused: this.isFocused,
      hasNativeFocus: false,
      selectValue: this.value || '',
      selectedValueIndex: findIndex(this.options, { value: this.value }),
      innerOptions: [...this.options],
    };
  },
  computed: {
    actualOtions() {
      return filter(this.innerOptions, option => option.value !== this.selectValue);
    },
    selectClasses() {
      return [
        this.$style.container,
        this.focused ? this.$style._focused : '',
        this.disabled ? this.$style._disabled : '',
        this.isVisibleError ? this.$style._error : '',
      ];
    },
    selectedItem() {
      return find(this.options, { value: this.selectValue });
    },
    selectedLabel() {
      return this.selectedItem ? this.selectedItem.label : this.placeholderLabel;
    },
    selectId() {
      return uniqueId('select');
    },
    label() {
      return `${this.prependLabel} ${this.selectedLabel} ${this.appendLabel}`.trim();
    },
    /**
     * Error is visible if it exists and error text isn't empty
     * @return {boolean}
     */
    isVisibleError() {
      return !!(this.hasError && this.errorText);
    },
  },
  created() {
    this.$addCssRules({
      [`.${this.$style.container}.${this.$style._disabled}`]: {
        opacity: this.$gui.selectDisabledOpacity,
      },
      [`.${this.$style.container}`]: {
        color: this.$gui.selectColor,
        'background-color': this.$gui.selectBoxColor,
      },
      [`.${this.$style.selected}`]: {
        'background-color': this.$gui.selectBoxColor,
        'border-color': this.$gui.selectBorderColor,
      },
      [`
        .${this.$style.selected}.${this.$style._focused},
        .${this.$style.selected}.${this.$style._nativeFocus}
      `]: {
        'border-color': this.$gui.selectFocusBorderColor,
      },
      [`.${this.$style.selected}:not(.${this.$style._focused}):hover`]: {
        'border-color': this.$gui.selectHoverBorderColor,
      },
      [`.${this.$style.input}`]: {
        color: this.$gui.selectColor,
        'background-color': this.$gui.selectBoxColor,
      },
      [`.${this.$style.input}.${this.$style._empty}`]: {
        color: this.$gui.selectPlaceholderColor,
      },
      [`.${this.$style.arrow} > svg`]: {
        fill: this.$gui.selectColor,
      },
      [`.${this.$style.box}`]: {
        'background-color': this.$gui.selectOptionsBoxColor,
      },
      [`.${this.$style.error}`]: {
        'background-color': this.$gui.errorBoxColor,
        color: this.$gui.errorColor,
      },
      [`.${this.$style.container}.${this.$style._error} .${this.$style.selected}`]: {
        'border-color': this.$gui.errorBorderColor,
      },
    });
  },
  methods: {
    blur() {
      this.$emit('blur');
      this.focused = false;
    },
    focus() {
      this.$emit('focus');
      this.focused = true;
    },
    selectOption(value) {
      this.setSelectValue(value);
      this.focused = false;
      this.$emit('blur');
      this.$emit('input', value);
      this.$refs.input.focus();
    },
    setSelectValue(value) {
      this.selectValue = value;
      this.selectedValueIndex = findIndex(this.options, { value: this.selectValue });
    },
    remove(value) {
      this.innerOptions = filter(this.innerOptions, option => option.value !== value);
      this.$emit('remove', value);
    },
    selectPrevItem() {
      let index = this.selectedValueIndex - 1;
      if (index < 0) {
        index = this.options.length - 1;
      }
      this.selectedValueIndex = index;
      this.selectValue = this.options[index].value;
      this.$emit('input', this.selectValue);
    },
    selectNextItem() {
      let index = this.selectedValueIndex + 1;
      if (index === this.options.length) {
        index = 0;
      }
      this.selectedValueIndex = index;
      this.selectValue = this.options[index].value;
      this.$emit('input', this.selectValue);
    },
  },
  watch: {
    value(value) {
      this.setSelectValue(value);
    },
    options(val) {
      this.innerOptions = val;
    },
    isFocused(value) {
      this.focused = value;
    },
  },
};
</script>

<style module lang="scss">
$error-font-size: 10px;
$error-font-weight: 600;
$error-height: 17px;
$primary-input-size: 15px;
$main-height: 24px;
$main-additional-height: 18px;

.container {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  font-size: $primary-input-size;

  &._disabled {
    pointer-events: none;
  }

  &._empty {
    opacity: 1;
  }

  &._error {
    opacity: 1;
  }
}
.wrapper {
  position: relative;
  box-sizing: border-box;
  padding: 18px 0;
  cursor: pointer;
}

.selected {
  display: flex;
  height: $main-height;
  line-height: $main-height;
  width: 100%;
  border: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease-out;
  cursor: pointer;
  font-family: inherit;
}

.error {
  top: $main-height + $main-additional-height + 2px;
  display: block;
  font-size: $error-font-size;
  font-weight: $error-font-weight;
  line-height: $error-height;
  position: absolute;
  padding: 0 5px;
  opacity: 0;
  transition: opacity 0.2s ease-out;
  pointer-events: none;

  &._showed {
    opacity: 1;
    pointer-events: auto;
  }

  @include if-ltr {
    border-radius: 0 3px 3px 3px;
  }

  @include if-rtl {
    border-radius: 3px 0 3px 3px;
  }
}
.icon {
  display: flex;
  align-items: center;
  flex-grow: 0;
  width: 18px;
  height: 23px;
  overflow: hidden;

  &._right {
    order: 2;
  }

  @include if-ltr {
    margin-right: 12px;
  }

  @include if-rtl {
    margin-left: 12px;
  }
}
.input {
  display: block;
  height: 24px;
  flex-grow: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border: none;
  outline: none;
  cursor: pointer;
  font-family: inherit;
  font-size: $primary-input-size;
  pointer-events: none;
  user-select: none;
}
.arrow {
  height: 24px;
  display: flex;
  align-items: center;
  order: 3;

  & > svg {
    transition: transform 0.2s ease-out;
  }

  &._focused {
    & > svg {
      transform: rotateX(180deg);
    }
  }

  &._reverse {
    & > svg {
      transform: rotateX(180deg);
    }

    &._focused {
      & > svg {
        transform: rotateX(0deg);
      }
    }
  }
}
.box {
  position: absolute;
  left: 0;
  z-index: 10;
  text-overflow: ellipsis;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.2s ease-out;
  white-space: nowrap;
  width: calc(100% + 20px);
  top: 42px;
  padding-bottom: 18px;

  &._focused {
    transition: transform 0.2s ease-out;
    transform: scaleY(1);
  }

  &._reverse {
    top: auto;
    bottom: 42px;
    transform-origin: bottom;
  }
}
.options {
  width: 100%;
  padding-right: 20px;
}
</style>
