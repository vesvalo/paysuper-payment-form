<template>
<div :class="$style.header">
  <div :class="$style.left">
    <div :class="$style.inner">
      <div
        v-if="isLoading"
        :class="$style.leftStub"
      >
        <span></span>
      </div>
      <template v-else>
        <span
          :class="$style.project"
          @click="fireAnalyticsEvent('Project')"
        >{{ projectName }}</span>
        <div
          :class="[$style.wrap, { [$style._opened]: isCartOpened }]"
          @click="toggleCart"
        >
          <IconArrow />
        </div>
        <div :class="[$style.additional, { [$style._opened]: isCartOpened }]">
          <!-- <span
            :class="$style.profile"
            @mouseenter="isProfileShown = true"
            @mouseleave="isProfileShown = false"
          >
            {{ $t('LayoutHeader.profile') }}
            <UiTip
              innerPosition="left"
              position="bottom"
              width="200px"
              :visible="isProfileShown"
            >
              <a
                href="#"
                :class="$style.tipLink"
                @click="fireAnalyticsEvent('PurchaseInformation')"
              >{{ $t('LayoutHeader.purchaseInformation') }}</a>
              <a
                href="#"
                :class="$style.tipLink"
                @click="fireAnalyticsEvent('PaymentManagement')"
              >{{ $t('LayoutHeader.paymentManagement') }}</a>
            </UiTip>
          </span> -->

          <a
            :class="$style.link"
            href="https://pay.super.com/policy/tou"
            target="_blank"
          >
            {{$t('LayoutHeader.termsOfUse')}}
          </a>
        </div>
      </template>
    </div>
  </div>

  <div :class="[$style.right, { [$style._isModal]: isModal }]">
    <div :class="$style.inner">
      <div
        v-if="isLoading"
        :class="$style.rightStub"
      >
        <span></span>
      </div>
      <template v-else>
        <a
          href="https://pay.super.com/"
          :class="$style.title"
          @click="fireAnalyticsEvent('PaySuper')"
          target="_blank"
        >PaySuper</a>
        <div :class="$style.icons">
          <a
            :class="$style.link"
            href="http://help.pay.super.com"
            target="_blank"
            @click="fireAnalyticsEvent('IconSupport')"
          >
            <IconSupport :class="$style.support" />
          </a>
          <div :class="$style.localeBox">
            <span
              :class="[$style.locale, { [$style._opened]: hasLocaleChangerOpened }]"
              @mouseenter="!isMobile && toggleLocaleChanger(true)"
              @mouseleave="!isMobile && toggleLocaleChanger(false)"
              v-touch:tap="toggleLocaleChanger"
              v-clickaway="closeLocaleChanger"
            >
              {{ $i18n.getLocaleLabel() }}
            </span>
            <UiTip
              innerPosition="right"
              position="bottom"
              section="form"
              maxHeight="390px"
              :class="$style.localeTip"
              :hasCaret="!isModal"
              :visible="hasLocaleChangerOpened"
              :visibleOnHover="!isMobile"
            >
              <LocaleCnanger
                layout="page"
                :class="$style.localeChanger"
                @changeLocale="toggleLocaleChanger(false)"
              />
            </UiTip>
          </div>
        </div>
      </template>
    </div>
  </div>
</div>
</template>

<script>
import { isBoolean } from 'lodash-es';
import { directive as clickaway } from 'vue-clickaway';
import LocaleCnanger from '@/components/LocaleChanger.vue';
import { gtagEvent } from '@/analytics';

export default {
  directives: { clickaway },
  components: { LocaleCnanger },
  props: {
    isCartOpened: {
      default: false,
      type: Boolean,
    },
    isModal: {
      type: Boolean,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
    projectName: {
      required: true,
      type: String,
    },
    isLoading: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      hasLocaleChangerOpened: false,
      isProfileShown: false,
    };
  },
  created() {
    this.$addCssRules({
      [`.${this.$style.left}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.left}:after`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
      [`
        .${this.$style.leftStub}:before,
        .${this.$style.leftStub} span:before,
        .${this.$style.leftStub} span:after,
        .${this.$style.rightStub}:before,
        .${this.$style.rightStub} span:before,
        .${this.$style.rightStub} span:after
      `]: {
        'background-color': this.$gui.stubContentColorPrimary,
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
      // [`.${this.$style.profile}:hover`]: {
      //   color: this.$gui.baseHoverColor,
      // },
      [`.${this.$style.wrap} > svg`]: {
        fill: this.$gui.headerProjectTitleColor,
      },
      [`.${this.$style.wrap}:hover > svg`]: {
        fill: this.$gui.baseHoverColor,
      },
      [`.${this.$style.title}`]: {
        color: this.$gui.headerServiceTitleColor,
      },
      [`.${this.$style.additional}`]: {
        color: this.$gui.layoutTextColor,
      },
      [`.${this.$style.locale}`]: {
        color: this.$gui.layoutTextColor,
      },
      [`.${this.$style.locale}:hover`]: {
        color: this.$gui.baseHoverColor,
      },
      // [`.${this.$style.tipLink}`]: {
      //   color: this.$gui.tipLinkColor,
      // },
      // [`.${this.$style.tipLink}:hover`]: {
      //   color: this.$gui.baseHoverColor,
      // },
      [`.${this.$style.link}`]: {
        color: this.$gui.layoutTextColor,
      },
      [`.${this.$style.link}:hover`]: {
        color: this.$gui.baseHoverColor,
      },
      [`.${this.$style.link} > svg`]: {
        fill: this.$gui.layoutTextColor,
      },
      [`.${this.$style.link}:hover > svg`]: {
        fill: this.$gui.baseHoverColor,
      },
    });
  },

  methods: {
    fireAnalyticsEvent(elementName) {
      gtagEvent(`click${elementName}Link`, { event_category: 'userAction' });
    },
    toggleCart() {
      gtagEvent('clickToggleCart', { event_category: 'userAction' });
      this.$emit('toggleCart');
    },
    closeLocaleChanger() {
      this.hasLocaleChangerOpened = false;
    },
    toggleLocaleChanger(value) {
      this.hasLocaleChangerOpened = isBoolean(value) ? value : !this.hasLocaleChangerOpened;
    },
  },
};
</script>

<style module lang="scss">
.header {
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap-reverse;

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
  height: 60px;
  justify-content: flex-end;
  position: relative;
  align-items: center;

  &._isModal {
    padding-right: 60px;
  }

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
    padding: 0 20px;

    @media screen and (min-width: 640px) {
      padding: 40px 30px 25px;
    }
  }

  @media screen and (min-width: 640px) {
    padding-left: 5.5vw;
    flex-basis: 260px;
    justify-content: flex-start;
    height: auto;
    align-items: normal;

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

  .right._isModal & {
    padding: 0 0 0 20px;
  }

  @media screen and (min-width: 640px) {
    max-width: 480px;
    align-items: flex-start;
  }
}

.leftStub {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  padding-top: 10px;

  &:before {
    content: '';
    width: 100px;
    height: 20px;
  }

  span {
    display: flex;

    &:before,
    &:after {
      content: '';
      width: 50px;
      height: 10px;
    }

    &:after {
      width: 60px;
      margin-left: 15px;
    }
  }
}

.rightStub {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: 40px;
  padding-bottom: 10px;
  box-sizing: border-box;

  &:before {
    content: '';
    width: 160px;
    height: 30px;
  }

  span {
    display: flex;
    align-items: center;

    &:before {
      content: '';
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin-right: 10px;
    }

    &:after {
      content: '';
      width: 50px;
      height: 10px;
    }
  }
}

.project {
  line-height: 24px;
  height: 24px;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.2s ease-out;

  &:hover {
    text-decoration: none;
  }

  @media screen and (min-width: 640px) {
    line-height: 40px;
    height: 40px;
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
      padding-top: 0px;
    }
  }
}
// .profile {
//   position: relative;
//   cursor: pointer;
//   margin-right: 20px;
//   transition: color 0.2s ease-out;

//   &:hover {
//     text-decoration: none;
//   }
// }
// .tipLink {
//   display: block;
//   font-size: 12px;
//   font-weight: 500;
//   text-decoration: none;
//   line-height: 18px;
//   transition: color 0.2s ease-out;

//   &:hover {
//     text-decoration: none;
//   }
// }
.wrap {
  cursor: pointer;
  height: 24px;
  line-height: 24px;

  & > svg {
    transition: fill 0.2s ease-out;
  }

  &._opened {
    & > svg {
      transform: rotateX(180deg);
    }
  }

  @media screen and (min-width: 640px) {
    display: none;
  }
}
.title {
  font-size: 16px;
  line-height: 40px;
  height: 40px;
  font-weight: bold;
  transition: color 0.2s ease-out;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
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
    width: 100%;
    width: 100vw;

    @include if-rtl {
      margin-right: 0;
      margin-left: -20px;
    }

    .right._isModal & {
      margin-right: -60px;

      @include if-rtl {
        margin-right: 0;
        margin-left: -20px;
      }
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
  transition: color 0.2s ease-out;

  &:hover {
    text-decoration: none;
  }
}
.link {
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;

  & > svg {
    vertical-align: middle;
  }
}
</style>
