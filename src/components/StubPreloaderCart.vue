<script>
export default {
  name: 'StubPreloaderCart',

  mounted() {
    this.$addCssRules({
      [`
        .${this.$style.cartStubHeader}:before,
        .${this.$style.cartStubHeader}:after,
        .${this.$style.cartStubFooter}:before
      `]: {
        'background-color': this.$gui.stubContentColorSecondary,
      },
      [` 
        .${this.$style.cartStubImage},
        .${this.$style.cartStubItem}:before,
        .${this.$style.cartStubItem}:after
      `]: {
        'background-color': this.$gui.stubContentColorPrimary,
      },
      [` 
        .${this.$style.cartStubItem}:nth-child(6):before,
        .${this.$style.cartStubItem}:nth-child(6):after
      `]: {
        'background-color': this.$gui.stubTotalColor,
      },
    });
  },
};
</script>

<template>
<div :class="$style.stubPreloaderCart">
  <div :class="$style.cartStubHeader"></div>
  <div :class="$style.cartStubImages">
    <span
      :class="$style.cartStubImage"
      v-for="n in 3"
      :key="n"
    ></span>
  </div>
  <div :class="$style.cartStubItems">
    <span
      :class="$style.cartStubItem"
      v-for="n in 6"
      :key="n"
    ></span>
  </div>
  <div :class="$style.cartStubFooter"></div>
</div>
</template>

<style lang="scss" module>
.stubPreloaderCart {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.cartStubHeader {
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:before,
  &:after {
    height: 7px;
    content: '';
  }
  &:before {
    width: 100px;
  }
  &:after {
    width: 60px;
  }
}

.cartStubImages {
  display: flex;
}

.cartStubImage {
  height: 86px;
  width: 33.33%;

  & + & {
    margin-left: 11px;
  }
}

.cartStubItems {
  display: flex;
  flex-direction: column;
}

.cartStubItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 23px;

  &:before,
  &:after {
    height: 7px;
    content: '';
  }

  &:after {
    width: 38px;
  }

  &:nth-child(1):before,
  &:nth-child(4):before {
    width: 138px;
  }
  &:nth-child(2):before {
    width: 108px;
  }
  &:nth-child(3):before,
  &:nth-child(5):before {
    width: 183px;
  }
  &:nth-child(6) {
    &:before,
    &:after {
      height: 10px;
    }
    &:before {
      width: 60px;
    }
  }
}

.cartStubFooter {
  display: flex;
  align-items: flex-end;
  flex-grow: 1;
  padding-bottom: 22px;

  &:before {
    height: 7px;
    width: 70px;
    content: '';
  }
}
</style>
