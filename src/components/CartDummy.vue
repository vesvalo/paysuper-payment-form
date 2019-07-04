<script>
export default {
  data() {
    return {
      containerWidth: '320px',
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.containerWidth = `${this.$el.clientWidth}px`;
      this.$addCssRules({
        [`.${this.$style.imageItemInner}::after, .${this.$style.itemCell}::after`]: {
          width: this.containerWidth,
        },
      });
    });

    this.$addCssRules({
      [`.${this.$style.imageItemInner}, .${this.$style.itemCell}`]: {
        'background-color': this.$gui.dummyContentColor,
      },
      [`.${this.$style._total} > .${this.$style.itemCell}`]: {
        'background-color': this.$gui.dummyTotalColor,
      },
      [`.${this.$style.imageItemInner}::after, .${this.$style.itemCell}::after`]: {
        'background-color': this.$gui.dummyContentSpinColor,
      },
      [`.${this.$style._total} > .${this.$style.itemCell}::after`]: {
        'background-color': this.$gui.dummyTotalSpinColor,
      },
    });
  },
};
</script>

<template>
<div :class="$style.container">
  <div :class="$style.images">
    <div
      v-for="index in 3"
      :key="index"
      :class="$style.imageItem"
    >
      <div :class="$style.imageItemInner"></div>
    </div>
  </div>
  <div :class="$style.items">
    <div
      v-for="index in 5"
      :class="$style.item"
      :key="index"
    >
      <span :class="[$style.itemCell, $style._title]"></span>
      <span :class="[$style.itemCell, $style._price]"></span>
    </div>
  </div>
  <div :class="$style.items">
    <div :class="[$style.item, $style._total]">
      <span :class="[$style.itemCell, $style._title]"></span>
      <span :class="[$style.itemCell, $style._price]"></span>
    </div>
  </div>
</div>
</template>

<style lang="scss" module>
.container {
  min-height: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}
.images {
  display: flex;
  flex-wrap: wrap;
  padding-top: 5px;
  margin: -5px -5px 9px -5px;
}
.imageItem {
  flex-grow: 1;
  flex-basis: 20%;
  box-sizing: border-box;
  margin: 5px;

  &:nth-child(2) > .imageItemInner::after {
    animation-delay: 0.11s;
  }

  &:nth-child(3) > .imageItemInner::after {
    animation-delay: 0.22s;
  }
}
.imageItemInner {
  width: 100%;
  padding-top: 100%;
  border-radius: 5px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    top: 0;
    position: absolute;
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
}
.items {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 6px;
}
.item {
  height: 7px;
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  position: relative;

  &:nth-child(1),
  &:nth-child(4) {
    & > .itemCell._title {
      width: 50%;
    }
  }

  &:nth-child(2) {
    & > .itemCell._title {
      width: 38%;
    }
  }

  &:nth-child(3),
  &:nth-child(5) {
    & > .itemCell._title {
      width: 65%;
    }
  }

  &._total {
    height: 10px;

    & > .itemCell {
      &._title {
        width: 21%;
      }
    }
  }
}
.itemCell {
  display: block;
  height: 100%;
  border-radius: 2px;
  overflow: hidden;
  position: relative;

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
