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
    tabindex: {
      default: undefined,
      type: [Number, String],
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
  created() {
    this.$addCssRules({
      [`.${this.container}`]: {
        color: this.$gui.checkboxColor,
        'border-color': this.$gui.checkboxColor,
      },
      [`.${this.container}:hover, .${this.container}.${this.stateChecked}:hover`]: {
        color: this.$gui.checkboxHoverColor,
        'border-color': this.$gui.checkboxHoverColor,
      },
      [`.${this.container}.${this.stateChecked}`]: {
        color: this.$gui.checkboxCheckedColor,
        'border-color': this.$gui.checkboxCheckedColor,
      },
      [`.${this.check} > svg`]: {
        fill: this.$gui.checkboxIconColor,
      },
      [`.${this.input}:focus ~ .${this.check}`]: {
        'border-color': this.$gui.checkboxHoverColor,
      },
      [`.${this.input}:focus ~ .${this.label}`]: {
        color: this.$gui.checkboxHoverColor,
      },
      [`.${this.container}.${this.stateChecked} > .${this.check} > svg`]: {
        fill: this.$gui.checkboxCheckedIconColor,
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

<template>
<label :class="[container, { [stateDisabled]: disabled, [stateChecked]: checked }]">
  <input
    v-bind="{ tabindex, checked, disabled }"
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

<style module lang="scss">
$label-margin: 10px;

.container {
  display: inline-flex;
  align-items: center;
  position: relative;
  vertical-align: top;
  cursor: pointer;
  border-width: 0;
  transition: border-color 0.2s ease-out, color 0.2s ease-out;

  &._disabled {
    pointer-events: none;
  }

  &._checked {
    cursor: pointer;
  }
}

.input {
  height: 0;
  position: absolute;
  width: 0;
  opacity: 0;

  &:checked + .check {
    border-width: 0;
  }
}

.check {
  border-radius: 50%;
  border-width: 1px;
  border-color: inherit;
  border-style: solid;
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
