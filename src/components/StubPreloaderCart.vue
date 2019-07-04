<script>
import { includes } from 'lodash-es';

export default {
  name: 'StubPreloaderCart',

  props: {
    layout: {
      type: String,
      default: 'modal',
      validator(value) {
        return includes(['modal', 'page'], value);
      },
    },
  },

  data() {
    return {
      containerWidth: '320px',
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.containerWidth = `${this.$el.clientWidth}px`;
      this.$addCssRules({
        [`
          .${this.$style.image}::after,
          .${this.$style.itemCell}::after
        `]: {
          width: this.containerWidth,
        },
      });
    });

    this.$addCssRules({
      [`
        .${this.$style.image}::before,
        .${this.$style.itemCell}
      `]: {
        'background-color': this.$gui.stubContentColorPrimary,
      },
      [`
        .${this.$style.image}::after,
        .${this.$style.itemCell}::after
      `]: {
        'background-color': this.$gui.stubSpinContentColorPrimary,
      },
      [`.${this.$style.item}:nth-child(6) > .${this.$style.itemCell}`]: {
        'background-color': this.$gui.stubTotalColor,
      },
    });
  },
};
</script>

<template>
<div :class="[$style.stubPreloaderCart, $style[`_layout-${layout}`]]">
  <div :class="$style.images">
    <div
      :class="$style.image"
      v-for="n in 3"
      :key="n"
    ></div>
  </div>
  <div :class="$style.items">
    <div
      :class="$style.item"
      v-for="n in 6"
      :key="n"
    >
      <div :class="[$style.itemCell, $style._left]"></div>
      <div :class="[$style.itemCell, $style._right]"></div>
    </div>
  </div>
</div>
</template>

<style lang="scss" module>
@mixin spinElem {
  top: 0;
  position: absolute;
  height: 100%;
  border-radius: 2px;
  animation: {
    name: spin;
    duration: 1.5s;
    timing-function: linear;
    iteration-count: infinite;
    fill-mode: backwards;
  }

  @include if-rtl {
    animation-direction: reverse;
  }
}

.stubPreloaderCart {
  display: flex;
  flex-direction: column;
  padding: 0 20px;

  &._layout-page {
    margin: 80px 0;
    padding: 0;
  }
}
.images {
  display: flex;
}
.image {
  width: 33.33%;
  border-radius: 6px;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    display: block;
    padding-top: 100%;
  }

  &::after {
    content: '';
    @include spinElem;
  }

  &:nth-child(2)::after {
    animation-delay: 0.11s;
  }

  &:nth-child(3)::after {
    animation-delay: 0.22s;
  }

  & + & {
    margin-left: 11px;
  }
}
.items {
  display: flex;
  flex-direction: column;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 23px;

  &:nth-child(1) > .itemCell._left,
  &:nth-child(4) > .itemCell._left {
    width: 50%;
  }
  &:nth-child(2) > .itemCell._left {
    width: 38%;
  }
  &:nth-child(3) > .itemCell._left,
  &:nth-child(5) > .itemCell._left {
    width: 65%;
  }
  &:nth-child(6) {
    & > .itemCell._left,
    & > .itemCell._right {
      height: 10px;
    }
    & > .itemCell._left {
      width: 20%;
    }
  }
}
.itemCell {
  height: 7px;
  border-radius: 2px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    @include spinElem;
  }

  &._right {
    width: 13%;

    &::after {
      animation-delay: 0.25s;
    }
  }
}
@keyframes spin {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(300%);
  }
}
</style>
