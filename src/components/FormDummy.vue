<script>
import { includes } from 'lodash-es';

export default {
  props: {
    layout: {
      default: 'modal',
      type: String,
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
        [`.${this.$style.itemCell}::after`]: {
          width: this.containerWidth,
        },
      });
    });

    this.$addCssRules({
      [`.${this.$style.itemCell}`]: {
        'background-color': this.$gui.dummyContentColor,
      },
      [`.${this.$style.itemCell}::after`]: {
        'background-color': this.$gui.dummyContentSpinColor,
      },
    });
  },
};
</script>

<template>
<div :class="[$style.container, $style[`_${layout}`]]">
  <div :class="$style.items">
    <div :class="$style.item">
      <span :class="$style.itemCell"></span>
    </div>
    <div :class="$style.item">
      <span :class="$style.itemCell"></span>
    </div>
    <div :class="$style.item">
      <span :class="$style.itemCell"></span>
      <span :class="[$style.itemCell, $style._second]"></span>
    </div>
    <div :class="$style.item">
      <span :class="$style.itemCell"></span>
    </div>
    <div :class="$style.item">
      <span :class="$style.itemCell"></span>
    </div>
    <div :class="[$style.item, $style._remember]">
      <span :class="[$style.itemCell, $style._circ]"></span>
      <span :class="[$style.itemCell, $style._remember]"></span>
    </div>
  </div>
</div>
</template>

<style lang="scss" module>
.container {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  flex-direction: column;
  align-content: flex-start;
  position: relative;
  width: 100%;
  max-height: calc(100% - 70px);

  &._modal {
    padding: 0 40px 20px;
  }

  &._page {
    @media screen and (min-width: 640px) {
      padding: 60px 0;
    }
  }
}
.items {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.item {
  height: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 25px 0;
  position: relative;

  &._remember {
    height: 16px;
    justify-content: flex-start;
  }
}
.itemCell {
  display: block;
  height: 100%;
  width: 100%;
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  &._second {
    margin-left: 20px;

    @include if-rtl {
      margin-left: 0;
      margin-right: 20px;
    }

    &::after {
      animation-delay: 0.152s;
    }
  }

  &._circ {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    margin-right: 10px;

    @include if-rtl {
      margin-right: 0;
      margin-left: 10px;
    }
  }

  &._remember {
    height: 10px;
    width: 40%;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    border-radius: 2px;
    animation: {
      name: loader;
      duration: 1.5s;
      timing-function: linear;
      iteration-count: infinite;
      fill-mode: backwards;
    }

    @include if-rtl {
      animation-direction: reverse;
    }
  }

  &._price {
    width: 14%;

    &::after {
      animation-delay: 0.25s;
    }
  }
}
@keyframes loader {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(300%);
  }
}
</style>
