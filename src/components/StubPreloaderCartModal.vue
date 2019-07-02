<script>
import StubPreloaderCart from '@/components/StubPreloaderCart.vue';

export default {
  name: 'StubPreloaderCartModal',

  components: {
    StubPreloaderCart,
  },

  mounted() {
    this.$addCssRules({
      [`
        .${this.$style.cartStubHeader}:before,
        .${this.$style.cartStubHeader}:after,
        .${this.$style.cartStubFooter}:before
      `]: {
        'background-color': this.$gui.stubContentColorSecondary,
      },
    });
  },
};
</script>

<template>
<div :class="$style.stubPreloaderCart">
  <div :class="$style.cartStubHeader"></div>
  <StubPreloaderCart />
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
}

.cartStubHeader {
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

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

.cartStubFooter {
  display: flex;
  align-items: flex-end;
  flex-grow: 1;
  padding: 0 0 22px 20px;

  &:before {
    height: 7px;
    width: 70px;
    content: '';
  }
}
</style>
