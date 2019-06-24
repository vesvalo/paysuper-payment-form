<template>
<div :class="$style.header">
  <div :class="$style.left">
    <div :class="$style.inner">
      <div :class="$style.project">{{projectName}}</div>
      <div
        :class="[$style.wrap, { [$style._opened]: isCartOpened }]"
        @click="toggleCart"
      >
        <IconArrow />
      </div>
      <div :class="[$style.additional, { [$style._opened]: isCartOpened }]">
        <div :class="$style.id">id897632299</div>
        <div
          :class="$style.terms"
          @mouseenter="isTermsShown = true"
          @mouseleave="isTermsShown = false"
        >
          {{$t('LayoutHeader.termsOfUse')}}
          <UiTip
            width="180px"
            innerPosition="right"
            position="bottom"
            :visible="isTermsShown"
          >
            <a href="#" :class="$style.tipLink">{{ $t('ModalCart.userAgreement') }}</a>
            <a href="#" :class="$style.tipLink">{{ $t('ModalCart.refundPolicy') }}</a>
            <span :class="$style.tipContent">{{ $t('ModalCart.refundAdditionalInfo') }}</span>
          </UiTip>
        </div>
      </div>
    </div>
  </div>

  <div :class="$style.right">
    <div :class="$style.inner">
      <div :class="$style.title">Pay Super</div>
      <div :class="$style.icons">
        <IconSupport :class="$style.support" />
        <div :class="$style.localeBox">
          <span
            :class="[$style.locale, { [$style._opened]: hasLocaleChangerOpened }]"
            @mouseenter="hasLocaleChangerOpened = true"
            @mouseleave="hasLocaleChangerOpened = false"
          >
            {{ $i18n.getLocaleLabel() }}
          </span>
          <UiTip
            innerPosition="right"
            position="bottom"
            section="form"
            maxHeight="390px"
            :class="$style.localeTip"
            :visible="hasLocaleChangerOpened"
          >
            <LocaleCnanger
              layout="page"
              :class="$style.localeChanger"
              @changeLocale="hasLocaleChangerOpened = false"
            />
          </UiTip>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import LocaleCnanger from '@/components/LocaleChanger.vue';

export default {
  components: { LocaleCnanger },
  props: {
    isCartOpened: {
      default: false,
      type: Boolean,
    },
    projectName: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      hasLocaleChangerOpened: false,
      isTermsShown: false,
    };
  },
  mounted() {
    this.$addCssRules({
      [`.${this.$style.left}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.left}:after`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
      [`.${this.$style.right}`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
      [`.${this.$style.right}:after`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.project}`]: {
        color: this.$gui.headerProjectTitleColor,
      },
      [`.${this.$style.wrap} > svg`]: {
        fill: this.$gui.headerProjectTitleColor,
      },
      [`.${this.$style.support}`]: {
        fill: this.$gui.headerTextColor,
      },
      [`.${this.$style.support}:hover`]: {
        fill: this.$gui.cartHoverTextColor,
      },
      [`.${this.$style.title}`]: {
        color: this.$gui.headerServiceTitleColor,
      },
      [`.${this.$style.additional}`]: {
        color: this.$gui.headerTextColor,
      },
      [`.${this.$style.locale}`]: {
        color: this.$gui.headerTextColor,
      },
      [`.${this.$style.locale}:hover`]: {
        color: this.$gui.cartHoverTextColor,
      },
      [`.${this.$style.tipLink}`]: {
        color: this.$gui.tipHeaderColor,
      },
      [`.${this.$style.tipLink}:hover`]: {
        color: this.$gui.tipLinkHoverColor,
      },
      [`.${this.$style.tipContent}`]: {
        color: this.$gui.tipContentColor,
      },
    });
  },

  methods: {
    toggleCart() {
      this.$emit('toggleCart');
    },
  },
};
</script>

<style module lang="scss">
.header {
  display: flex;
  flex-grow: 0;
  flex-wrap: wrap-reverse;
  z-index: 1;

  @include if-rtl {
    flex-direction: row-reverse;
  }
}
.left {
  display: flex;
  flex-basis: 320px;
  flex-grow: 1;
  flex-wrap: wrap;
  position: relative;

  @include if-rtl {
    flex-direction: row-reverse;
  }

  &:after {
    content: '';
    position: absolute;
    height: 3px;
    left: 0;
    bottom: -3px;
  }

  & > .inner {
    padding: 30px 30px 15px;
  }

  @media screen and (min-width: 640px) {
    padding-right: 5.5vw;
    flex-basis: 260px;
    justify-content: flex-end;
    height: auto;

    &:after {
      right: 5.5vw;
    }

    & > .inner {
      padding: 100px 0 40px 5.5vw;
    }
  }

  @media screen and (min-width: 1080px) {
    padding-right: 60px;

    &:after {
      right: 60px;
    }

    & > .inner {
      padding-left: 60px;
    }
  }
}
.right {
  display: flex;
  flex-basis: 320px;
  flex-grow: 1;
  height: 130px;
  justify-content: flex-end;
  position: relative;

  @include if-rtl {
    flex-direction: row-reverse;
  }

  &:after {
    content: '';
    position: absolute;
    height: 3px;
    bottom: -3px;
    right: 0;
  }

  & > .inner {
    padding: 40px 30px 25px;
  }

  @media screen and (min-width: 640px) {
    padding-left: 5.5vw;
    flex-basis: 260px;
    justify-content: flex-start;
    height: auto;

    &:after {
      left: 5.5vw;
    }

    & > .inner {
      padding: 100px 5.5vw 40px 0;
    }
  }

  @media screen and (min-width: 1080px) {
    padding-left: 60px;

    &:after {
      left: 60px;
    }

    & > .inner {
      padding-right: 60px;
    }
  }
}
.inner {
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-end;

  @media screen and (min-width: 640px) {
    max-width: 480px;
    align-items: flex-start;
  }
}
.project {
  line-height: 24px;
  height: 24px;
  font-size: 16px;
  font-weight: bold;

  @media screen and (min-width: 640px) {
    line-height: 40px;
    height: 40px;
    font-size: 20px;
  }
}
.additional {
  display: none;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;

  &._opened {
    display: flex;
    width: 100%;
    padding-top: 12px;
  }

  @media screen and (min-width: 640px) {
    display: flex;
    line-height: 40px;
    height: 40px;
    justify-content: space-between;

    &._opened {
      width: auto;
      padding-top: 4px;
    }
  }
}
.id {
  margin-right: 20px;
}
.terms {
  position: relative;
  cursor: pointer;
}
.tipLink,
.tipContent {
  display: block;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  line-height: 18px;
}
.tipContent {
  margin-top: 12px;
}
.wrap {
  cursor: pointer;
  height: 24px;
  line-height: 24px;

  &._opened {
    & > svg {
      transform: rotateX(180deg);
    }
  }

  @media screen and (min-width: 640px) {
    display: none;
  }
}
.support {
  cursor: pointer;
}
.title {
  font-size: 30px;
  line-height: 40px;
  height: 40px;
  font-weight: bold;
}
.icons {
  display: flex;
  line-height: 40px;
  height: 40px;
  align-items: center;
}
.localeBox {
  position: relative;
  margin-left: 10px;

  & > .localeTip {
    padding: 0;
    display: flex;
    flex-direction: column;
    margin-right: -20px;
    width: calc(100vw - 40px);

    @include if-rtl {
      margin-right: 0;
      margin-left: -20px;
    }

    @media screen and (min-width: 640px) {
      width: 180px;
    }
  }

  @include if-rtl {
    margin-right: 10px;
    margin-left: 0;
  }
}
.locale {
  font-size: 12px;
  cursor: pointer;
  line-height: 15px;
  height: 15px;
}
</style>
