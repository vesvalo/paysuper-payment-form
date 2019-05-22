<template>
<button
  :class="[container, { [stateDisabled]: disabled, [hasRadius]: hasBorderRadius } ]"
  @click="onClick"
>
  <span :class="before">
    <slot name="before" />
  </span>

  <slot />

  <span :class="after">
    <slot name="after" />
  </span>
</button>
</template>

<script>
export default {
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    hasBorderRadius: {
      default: true,
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
    before() {
      return this.$style.before;
    },
    after() {
      return this.$style.after;
    },
    hasRadius() {
      return this.$style._hasRadius;
    },
  },
  mounted() {
    this.$addCssRules({
      [`.${this.container}`]: {
        color: this.$gui.buttonColor,
        'background-color': this.$gui.buttonBoxColor,
        'justify-content': this.$gui.buttonAlign,
      },
      [`.${this.container}:hover`]: {
        'background-color': this.$gui.buttonHoverBoxColor,
      },
      [`.${this.container}:active`]: {
        'background-color': this.$gui.buttonActiveBoxColor,
      },
      [`.${this.container}.${this.stateDisabled}`]: {
        opacity: this.$gui.buttonDisabledOpacity,
      },
      [`.${this.before}`]: {
        color: this.$gui.buttonBeforeColor,
        'margin-right': this.$gui.buttonBeforeMargin,
      },
      [`.${this.after}`]: {
        color: this.$gui.buttonAfterColor,
        'margin-right': this.$gui.buttonAfterMargin,
      },
    });
  },
  methods: {
    onClick(event) {
      // If button has disabled we shoudn't send events
      if (this.disabled) {
        return;
      }

      this.$emit('click', event);
    },
  },
};
</script>

<style module lang="scss">
@import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400,700|Quicksand&subset=cyrillic,cyrillic-ext');

$after-margin: 12px;
$before-margin: 12px;
$after-text-color: #fff;
$before-text-color: #fff;
$box-color: #5b88de;
$font-family: 'Quicksand', 'Comfortaa', sans-serif;
$font-size: 20px;
$font-weight: 700;
$height: 70px;
$padding: 0 24px;
$text-color: #fff;
$align: center;
$border-width: 0;
$border-color: transparent;
$hover-box-color: lighten($box-color, 3%);
$active-box-color: darken($box-color, 3%);
$disabled-opacity: 0.7;
$border-radius: 12px;
$transition: background-color 0.2s ease-out, color 0.2s ease-out;

.container {
  cursor: pointer;
  outline-width: 0;
  position: relative;
  display: inline-flex;
  background-color: $box-color;
  font-family: $font-family;
  font-size: $font-size;
  font-weight: $font-weight;
  height: $height;
  padding: $padding;
  color: $text-color;
  align-items: center;
  justify-content: $align;
  border-width: $border-width;
  border-color: $border-color;
  transition: $transition;
  vertical-align: top;

  &:hover {
    background-color: $hover-box-color;
  }

  &:active {
    background-color: $active-box-color;
  }

  &._hasRadius {
    border-radius: $border-radius;
  }

  &._disabled {
    pointer-events: none;
    opacity: $disabled-opacity;
  }
}

.before {
  display: inline-flex;
  color: $before-text-color;
  margin-right: $before-margin;
}

.after {
  display: inline-flex;
  color: $after-text-color;
  margin-left: $after-margin;
}
</style>
