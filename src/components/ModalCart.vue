<template>
<div :class="$style.layout">
  <div :class="$style.header">
    <a :class="$style.link">{{ orderData.project.name }}</a>
    <span
      :class="$style.link"
      @mouseenter="isProfileShown = true"
      @mouseleave="isProfileShown = false"
    >
      {{ $t('ModalCart.profile') }}
      <UiTip
        innerPosition="right"
        width="166px"
        :visible="isProfileShown"
      >
        <a href="#" :class="$style.tipLink">
          Purchase information
        </a>
        <a href="#" :class="$style.tipLink">
          Payment management
        </a>
      </UiTip>
    </span>
  </div>

  <div :class="$style.content">
    <slot/>
  </div>

  <div :class="$style.footer">
    <span
      :class="$style.link"
      @mouseenter="isTermsShown = true"
      @mouseleave="isTermsShown = false"
    >
      {{ $t('ModalCart.termsOfUse') }}
      <UiTip
        position="top"
        width="240px"
        :visible="isTermsShown"
      >
        <a href="#" :class="$style.tipLink">
          User Agreement
        </a>
        <a href="#" :class="$style.tipLink">
          Refund Policy
        </a>
      </UiTip>
    </span>
    <a href="#" :class="$style.link">{{ $t('ModalCart.support') }}</a>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      isProfileShown: false,
      isTermsShown: false,
    };
  },
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
      [`.${this.$style.tipLink}`]: {
        color: this.$gui.headerTextColor,
      },
      [`.${this.$style.tipLink}:hover`]: {
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
  position: relative;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  line-height: 20px;
  cursor: pointer;
}
.tipLink {
  display: block;
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
