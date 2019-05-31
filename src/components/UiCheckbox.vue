<template>
<label :class="[container, { [stateDisabled]: disabled, [stateChecked]: checked }]">
  <input
    v-bind="{ checked, disabled }"
    type="checkbox"
    :class="input"
    @change="emitChange"
  >

  <div :class="check">
    <IconCheck v-if="checked" />
  </div>

  <span :class="label">
    <slot/>
  </span>
</label>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'input',
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
  },
  computed: {
    container() {
      return this.$style.container;
    },
    stateChecked() {
      return this.$style._checked;
    },
    stateDisabled() {
      return this.$style._disabled;
    },
    input() {
      return this.$style.input;
    },
    check() {
      return this.$style.check;
    },
    label() {
      return this.$style.label;
    },
  },
  mounted() {
    this.$addCssRules({
      [`.${this.container}`]: {
        color: this.$gui.checkboxColor,
        'border-color': this.$gui.checkboxColor,
      },
      [`.${this.container}:hover`]: {
        color: this.$gui.checkboxHoverColor,
        'border-color': this.$gui.checkboxHoverColor,
      },
      [`.${this.container}.${this.stateChecked}`]: {
        color: this.$gui.checkboxCheckedColor,
        'border-color': this.$gui.checkboxCheckedColor,
      },
      [`.${this.container}.${this.stateDisabled}`]: {
        opacity: this.$gui.checkboxDisabledOpacity,
      },
    });
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

<style module lang="scss">
@import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400|Quicksand&subset=cyrillic,cyrillic-ext');
@import '@/assets/styles/directional.scss';

$common-font-family: 'Quicksand', 'Comfortaa', sans-serif;
$box-color: transparent;
$disabled-opacity: 0.5;
$border-color: #fff;
$hover-check-color: #06eaa7;
$text-color: #fff;
$hover-text-color: #06eaa7;
$label-margin: 10px;

.container {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-family: $common-font-family;
  vertical-align: top;
  cursor: pointer;
  color: $text-color;
  border-width: 0;
  border-color: $border-color;

  &:hover {
    color: $hover-text-color;
    border-color: $hover-check-color;
  }

  &._disabled {
    pointer-events: none;
    opacity: $disabled-opacity;
  }

  &._checked {
    color: $hover-text-color;
    border-color: $hover-check-color;
  }
}

.input {
  height: 0;
  position: absolute;
  visibility: hidden;
  width: 0;

  &:checked + .check {
    border-width: 0;
  }
}

.check {
  border-radius: 50%;
  border-width: 1px;
  border-color: inherit;
  border-style: solid;
  background-color: $box-color;
  box-sizing: border-box;
  height: 20px;
  width: 20px;
}

.label {
  @include if-ltr {
    margin-left: $label-margin;
  }

  @include if-rtl {
    margin-right: $label-margin;
  }

  &:empty {
    display: none;
  }
}
</style>
