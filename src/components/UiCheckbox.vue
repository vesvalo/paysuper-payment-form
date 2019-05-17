<template>
<label :class="[container, { [stateDisabled]: disabled }]">
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
  },
  computed: {
    container() {
      return this.$style.container;
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
    const selectors = {
      container: this.container,
      input: this.input,
      check: this.check,
      label: this.label,
    };
    const states = ['default', 'checked'];

    this.$addCssRules('checkbox', selectors, states);
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

  &:hover:not(._disabled) {
    .label {
      color: $hover-text-color;
    }

    .check {
      border-color: $hover-check-color;
    }
  }

  &._disabled {
    pointer-events: none;
    opacity: $disabled-opacity;
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
}
.label {
  margin-left: $label-margin;
  color: $text-color;

  &:empty {
    display: none;
  }
}
</style>
