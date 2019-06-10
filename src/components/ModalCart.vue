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
    const shadowRgbData = this.$gui.cartBoxShadowColor.replace(/[^\d\s,]/g, '');

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
        'box-shadow': `
          0px 20px 0px 0px rgba(${shadowRgbData}, 0.9),
          0px 1px 0px 0px rgba(${shadowRgbData}, 0.35),
          0px 2px 0px 0px rgba(${shadowRgbData}, 0.3),
          0px 3px 0px 0px rgba(${shadowRgbData}, 0.25),
          0px 4px 0px 0px rgba(${shadowRgbData}, 0.2),
          0px 5px 0px 0px rgba(${shadowRgbData}, 0.15),
          0px 6px 0px 0px rgba(${shadowRgbData}, 0.1),
          0px 7px 0px 0px rgba(${shadowRgbData}, 0.05)
        `,
      },
      [`.${this.$style.footer}`]: {
        'box-shadow': `
          0px -20px 0px 0px rgba(${shadowRgbData}, 0.9),
          0px -1px 0px 0px rgba(${shadowRgbData}, 0.35),
          0px -2px 0px 0px rgba(${shadowRgbData}, 0.3),
          0px -3px 0px 0px rgba(${shadowRgbData}, 0.25),
          0px -4px 0px 0px rgba(${shadowRgbData}, 0.2),
          0px -5px 0px 0px rgba(${shadowRgbData}, 0.15),
          0px -6px 0px 0px rgba(${shadowRgbData}, 0.1),
          0px -7px 0px 0px rgba(${shadowRgbData}, 0.05)
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
  padding: 20px 20px 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
  overflow: visible;
  box-shadow: 0px 20px 0px 0px darken(rgba(#333b50, 0.9), 0.5%),
    0px 1px 0px 0px darken(rgba(#333b50, 0.35), 0.5%),
    0px 2px 0px 0px darken(rgba(#333b50, 0.3), 0.5%),
    0px 3px 0px 0px darken(rgba(#333b50, 0.25), 0.5%),
    0px 4px 0px 0px darken(rgba(#333b50, 0.2), 0.5%),
    0px 5px 0px 0px darken(rgba(#333b50, 0.15), 0.5%),
    0px 6px 0px 0px darken(rgba(#333b50, 0.1), 0.5%),
    0px 7px 0px 0px darken(rgba(#333b50, 0.05), 0.5%);
}
.link {
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  line-height: 20px;

  &:hover {
    color: #00d697;
  }
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
  padding: 0 20px 20px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  box-shadow: 0 -20px 0 0 darken(rgba(#333b50, 0.9), 0.5%),
    0 -1px 0 0 darken(rgba(#333b50, 0.35), 0.5%),
    0 -2px 0 0 darken(rgba(#333b50, 0.3), 0.5%),
    0 -3px 0 0 darken(rgba(#333b50, 0.25), 0.5%),
    0 -4px 0 0 darken(rgba(#333b50, 0.2), 0.5%),
    0 -5px 0 0 darken(rgba(#333b50, 0.15), 0.5%),
    0 -6px 0 0 darken(rgba(#333b50, 0.1), 0.5%),
    0 -7px 0 0 darken(rgba(#333b50, 0.05), 0.5%);

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
