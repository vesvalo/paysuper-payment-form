<template>
<div
  v-clickaway="blur"
  :class="selectClasses"
>
  <div
    :class="[$style.selected, { [$style._focused]: focused }]"
    @click="focused = !focused"
  >
    <div
      v-if="selectedItem.iconComponent"
      :class="$style.icon"
    >
      <component :is="selectedItem.iconComponent" />
    </div>
    <input
      :class="[$style.input, { [$style._focused]: focused }]"
      :value="label"
      :readonly="true"
    />
    <div :class="[$style.arrow, { [$style._focused]: focused }]">
      <IconArrow />
    </div>
  </div>
  <div :class="[$style.box, { [$style._focused]: focused }]">
    <UiScrollbarBox :class="$style.scrollbar">
      <div :class="$style.options">
        <UiSelectOption
          v-for="option in actualOtions"
          :key="option.value"
          :option="option"
          :selectId="selectId"
          @input="emitChange"
        />
      </div>
    </UiScrollbarBox>
  </div>
</div>
</template>

<script>
import { directive as clickaway } from 'vue-clickaway';
import {
  get,
  filter,
  find,
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
    prependLabel: {
      default: '',
      type: String,
    },
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
    actualOtions() {
      return filter(this.options, option => option.value !== this.selectValue);
    },
    selectClasses() {
      return [
        this.$style.container,
        this.focused ? this.$style._focused : '',
        this.selectValue === '' ? this.$style._empty : '',
        this.disabled ? this.$style._disabled : '',
      ];
    },
    selectedItem() {
      return find(this.options, { value: this.selectValue });
    },
    selectedLabel() {
      return this.selectedItem ? this.selectedItem.label : '';
    },
    selectId() {
      return uniqueId('select');
    },
    label() {
      return `${this.prependLabel} ${this.selectedLabel} ${this.appendLabel}`.trim();
    },
  },
  mounted() {
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
      [`.${this.$style.selected}.${this.$style._focused}`]: {
        'border-color': this.$gui.selectFocusBorderColor,
      },
      [`.${this.$style.selected}:not(.${this.$style._focused}):hover`]: {
        'border-color': this.$gui.selectHoverBorderColor,
      },
      [`.${this.$style.input}`]: {
        color: this.$gui.selectColor,
        'background-color': this.$gui.selectBoxColor,
      },
      [`.${this.$style.arrow} > svg`]: {
        fill: this.$gui.selectColor,
      },
      [`.${this.$style.box}`]: {
        'background-color': this.$gui.selectOptionsBoxColor,
      },
    });
  },
  methods: {
    blur() {
      this.focused = false;
    },
    emitChange(value) {
      this.selectValue = value;
      this.focused = false;
      this.$emit('input', value);
    },
  },
  watch: {
    value(val) {
      this.selectValue = val;
    },
  },
};
</script>

<style module lang="scss">
@import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400|Quicksand&subset=cyrillic,cyrillic-ext');
@import '@/assets/styles/directional.scss';

$font-family: 'Quicksand', 'Comfortaa', sans-serif;

$background-color: transparent;
$input-color: #fff;
$options-color: #424C66;
$border-color: rgba(255, 255, 255, 0.2);
$hover-border-color: rgba(255, 255, 255, 0.5);
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
  font-size: 15px;
  color: $input-color;
  font-family: $font-family;
  padding: 18px 0;

  &._focused {
    height: 100%;
  }

  &._disabled {
    opacity: $disabled-opacity;
    pointer-events: none;
  }
}
.selected {
  display: flex;
  height: 24px;
  line-height: 24px;
  width: 100%;
  background-color: $background-color;
  border: none;
  border-bottom: 1px solid $border-color;
  cursor: pointer;
  font-family: $font-family;

  &._focused {
    border-color: $focus-border-color;
  }

  &:not(._focused):hover {
    border-color: $hover-border-color;
  }
}
.icon {
  flex-grow: 0;

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
  background-color: $background-color;
  border: none;
  outline: none;
  color: $input-color;
  cursor: pointer;
  font-family: $font-family;
  font-size: 15px;
  pointer-events: none;
}
.arrow {
  height: 24px;
  display: flex;
  align-items: center;

  & > svg {
    fill: $input-color;
  }

  &._focused {
    & > svg {
      transform: rotateX(180deg);
    }
  }
}
.box {
  position: absolute;
  background-color: $options-color;
  left: 0;
  z-index: 10;
  text-overflow: ellipsis;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.2s ease-out;
  white-space: nowrap;
  width: calc(100% + 20px);
  top: 42px;
  height: calc(100% - 36px);

  &._focused {
    transition: transform 0.2s ease-out;
    transform: scaleY(1);
  }
}
.scrollbar {
  height: 100%;
}
.options {
  width: 100%;
  padding-right: 20px;
}
</style>
