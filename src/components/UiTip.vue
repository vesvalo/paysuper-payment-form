<script>
import { includes, upperFirst } from 'lodash-es';

export default {
  props: {
    height: {
      default: '',
      type: String,
    },
    width: {
      default: '',
      type: String,
    },
    maxHeight: {
      default: '',
      type: String,
    },
    innerPosition: {
      default: 'left',
      type: String,
      validator(value) {
        return includes(['center', 'left', 'right'], value);
      },
    },
    position: {
      default: 'top',
      type: String,
      validator(value) {
        return includes(['bottom', 'top'], value);
      },
    },
    section: {
      default: 'cart',
      type: String,
      validator(value) {
        return includes(['cart', 'form'], value);
      },
    },
    hasCaret: {
      default: true,
      type: Boolean,
    },
    visible: {
      default: false,
      type: Boolean,
    },
    visibleOnHover: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      innerVisible: false,
      timeoutId: 0,
      isMobile: false,
    };
  },
  mounted() {
    this.isMobile = window.innerWidth < 640 || window.innerHeight < 510;
    const containerClass = this.$style.container;
    const sectionClass = this.$style[`_${this.section}`];
    const tipBoxColor = this.$gui[`tip${upperFirst(this.section)}BoxColor`];

    this.$addCssRules({
      [`.${containerClass}`]: {
        color: this.$gui.tipContentColor,
      },
      [`.${containerClass}.${sectionClass}`]: {
        'background-color': tipBoxColor,
      },
      [`.${containerClass}.${this.$style._bottom}.${sectionClass}::after`]: {
        'border-bottom-color': tipBoxColor,
      },
      [`.${containerClass}.${this.$style._top}.${sectionClass}::after`]: {
        'border-top-color': tipBoxColor,
      },
    });
  },
  methods: {
    hide() {
      if (this.timeoutId) {
        return;
      }

      this.timeoutId = setTimeout(() => {
        this.innerVisible = false;

        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }, 300);
    },
    show() {
      this.innerVisible = true;

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = 0;
    },
    setInnerVisible() {
      this.innerVisible = !this.isMobile;
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.show();
      } else {
        this.hide();
      }
    },
  },
};
</script>

<template>
<div
  :class="[
    $style.container,
    $style[`_${position}`],
    $style[`_inner-${innerPosition}`],
    $style[`_${section}`],
    {
      [$style._shown]: visible || innerVisible,
      [$style._hasCaret]: hasCaret,
      [$style._visibleOnHover]: visibleOnHover,
    },
  ]"
  :style="{
    height: height || undefined,
    width: width || undefined,
    maxHeight: maxHeight ? maxHeight : undefined,
  }"
  @mouseenter="setInnerVisible"
  @mouseleave="hide"
>
  <slot />
</div>
</template>

<style module lang="scss">
.container {
  position: absolute;
  border-radius: 6px;
  font-size: 12px;
  line-height: 18px;
  padding: 12px 15px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease-out;
  z-index: 20;
  cursor: auto;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    cursor: default;
  }

  &._bottom {
    transform: translate3d(0, 20px, 0);
    top: calc(100% + 10px);

    &._inner-center {
      transform: translate3d(-50%, 20px, 0);
    }

    &::after {
      top: -11px;
    }
  }

  &._top {
    transform: translate3d(0, -20px, 0);
    bottom: calc(100% + 10px);

    &._inner-center {
      transform: translate3d(-50%, -20px, 0);
    }

    &::after {
      bottom: -11px;
    }
  }

  &._inner-right {
    @include if-ltr {
      right: 0;

      &::after {
        right: 20px;
      }
    }

    @include if-rtl {
      left: 0;

      &::after {
        left: 20px;
      }
    }
  }

  &._inner-left {
    @include if-ltr {
      left: 0;

      &::after {
        left: 20px;
      }
    }

    @include if-rtl {
      right: 0;

      &::after {
        right: 20px;
      }
    }
  }

  &._inner-center {
    left: 50%;

    &::after {
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
    }
  }

  &._cart,
  &._form {
    position: absolute;
  }

  &._shown,
  &._visibleOnHover:hover {
    pointer-events: auto;
    opacity: 1;
    transform: translate3d(0, 0, 0);

    &._inner-center {
      transform: translate3d(-50%, 0, 0);
    }
  }

  &._hasCaret {
    &::after {
      content: '';
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      border: 6px solid transparent;
    }
  }
}
</style>
