<template>
<div :class="$style.layout">
  <div :class="$style.header">
    <a href="#" :class="$style.link">{{orderData.project.name}}</a>
    <a href="#" :class="$style.link">{{$t('ModalCart.profile')}}</a>
  </div>

  <div :class="$style.content">
    <slot/>
  </div>

  <div :class="$style.footer">
    <a href="#" :class="$style.link">{{$t('ModalCart.termsOfUse')}}</a>
    <a href="#" :class="$style.link">{{$t('ModalCart.support')}}</a>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('PaymentForm', [
      'orderData',
    ]),
  },
  mounted() {
    this.$addCssRules({
      [`.${this.$style.layout}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.link}`]: {
        color: this.$gui.headerTextColor,
      },
      [`.${this.$style.link}:hover`]: {
        color: this.$gui.cartHoverTextColor,
      },
      [`.${this.$style.header}`]: {
        'background-image': `
          linear-gradient(
            180deg,
            ${this.$gui.cartBackgroundColor} 51.5%,
            ${this.$gui.cartBoxShadowColor} 100%
          )
        `,
      },
      [`.${this.$style.footer}`]: {
        'background-image': `
          linear-gradient(
            180deg,
            ${this.$gui.cartBoxShadowColor} 0%,
            ${this.$gui.cartBackgroundColor} 41%
          )
        `,
      },
    });
  },
};
</script>

<style module lang="scss">
.layout {
  width: 320px;
  min-height: 100%;
  position: relative;
  display: flex;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 55px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
}
.link {
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  line-height: 20px;
}
.content {
  display: flex;
  z-index: 1;
  position: relative;
  width: 100%;
}
.footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 30px 20px 20px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;

  & > .link {
    @include if-ltr {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }

    @include if-rtl {
      &:not(:last-child) {
        margin-left: 16px;
      }
    }
  }
}
</style>
