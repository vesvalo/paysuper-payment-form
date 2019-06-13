<script>
import { includes } from 'lodash-es';

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
        return includes(['left', 'right'], value);
      },
    },
    position: {
      default: 'bottom',
      type: String,
      validator(value) {
        return includes(['bottom', 'top'], value);
      },
    },
    visible: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      innerVisible: false,
      timeoutId: 0,
    };
  },
  mounted() {
    this.$addCssRules({
      [`.${this.$style.container}`]: {
        'background-color': this.$gui.tipBoxColor,
      },
      [`.${this.$style.container}.${this.$style._bottom}::after`]: {
        'border-bottom-color': this.$gui.tipBoxColor,
      },
      [`.${this.$style.container}.${this.$style._top}::after`]: {
        'border-top-color': this.$gui.tipBoxColor,
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
    { [$style._shown]: visible || innerVisible }
  ]"
  :style="{
    height: height || 'auto',
    width: width || 'auto',
    maxHeight: maxHeight ? maxHeight : undefined,
  }"
  @mouseenter="innerVisible = true"
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
  transition: all 0.2s ease-in-out;

  &._bottom {
    transform: translate3d(0, 20px, 0);
    top: calc(100% + 10px);

    &::after {
      top: -12px;
    }
  }

  &._top {
    transform: translate3d(0, -20px, 0);
    bottom: calc(100% + 10px);

    &::after {
      bottom: -12px;
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

  &._shown {
    pointer-events: all;
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    border: 6px solid transparent;
  }
}
</style>
