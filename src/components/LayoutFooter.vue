<script>
import { gtagEvent } from '@/analytics';

export default {
  name: 'LayoutFooter',

  props: {
    isLoading: {
      default: false,
      type: Boolean,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isProfileShown: false,
    };
  },

  created() {
    this.$addCssRules({
      [`.${this.$style.left}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.right}`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
      [`.${this.$style.links}:before`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
      [`
        .${this.$style.stub}:before,
        .${this.$style.stub} span,
        .${this.$style.stub}:after
      `]: {
        'background-color': this.$gui.stubContentColorSecondary,
      },
      [`.${this.$style.link}`]: {
        color: this.$gui.layoutTextColor,
      },
      [`.${this.$style.link}:hover`]: {
        color: this.$gui.baseHoverColor,
      },
      [`.${this.$style.tipLink}`]: {
        color: this.$gui.tipLinkColor,
      },
      [`.${this.$style.tipLink}:hover`]: {
        color: this.$gui.baseHoverColor,
      },
    });
  },

  methods: {
    fireAnalyticsEvent(elementName) {
      gtagEvent(`click${elementName}Link`, { event_category: 'userAction' });
    },
  },
};
</script>

<template>
<div :class="$style.footer">
  <div :class="$style.left">
    <div :class="$style.links">
      <div
        v-if="isLoading"
        :class="$style.stub"
      >
        <span></span>
      </div>
      <div
        v-else
        :class="$style.linkBox"
      >
        <span
          :class="$style.link"
          @mouseenter="isProfileShown = true"
          @mouseleave="isProfileShown = false"
        >
          {{ $t('LayoutFooter.legalInfo') }}
          <UiTip
            position="top"
            width="260px"
            :innerPosition="isMobile ? 'center' : 'right'"
            :visible="isProfileShown"
          >
            <a
              :class="$style.tipLink"
              href="https://pay.super.com/policy/eula"
              target="_blank"
              @click="fireAnalyticsEvent('UserAgreement')"
            >
              {{$t('LayoutFooter.userAgreement')}}
            </a>
            <a
              :class="$style.tipLink"
              href="https://pay.super.com/policy/tou"
              target="_blank"
              @click="fireAnalyticsEvent('TermsOfUse')"
            >
              {{ $t('LayoutFooter.termsOfUse') }}
            </a>
            <!-- @TODO: return this items after recovery our support services
            <a
              :class="$style.tipLink"
              href="http://help.pay.super.com"
              target="_blank"
              @click="fireAnalyticsEvent('Support')"
            >
              {{$t('LayoutFooter.support')}}
            </a>
            -->
          </UiTip>
        </span>
      </div>
    </div>
  </div>
  <div :class="$style.right"></div>
</div>
</template>

<style module lang="scss">
.footer {
  display: flex;
  flex-grow: 1;

  @include if-rtl {
    flex-direction: row-reverse;
  }
}
.left {
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
}
.right {
  @media screen and (min-width: 640px) {
    width: 100%;
  }
}
.links {
  display: flex;
  line-height: 18px;
  padding: 52px 0 52px;
  width: 100%;
  margin: 0 30px;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    height: 3px;
    left: 0;
    right: 0;
    top: 24px;
  }

  @media screen and (min-width: 640px) {
    margin: 0 5.5vw 0 0;
    padding: 12px 0 40px;
    margin-top: 30px;
    justify-content: flex-end;

    @include if-rtl {
      flex-direction: row-reverse;
    }

    &::before {
      top: -24px;
    }
  }

  @media screen and (min-width: 1080px) {
    margin: 30px 60px 0 0;
  }
}
.linkBox {
  display: flex;
  max-width: 420px;
  width: 100%;
  justify-content: center;

  @media screen and (min-width: 640px) {
    justify-content: flex-end;
  }
}
.link {
  position: relative;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  line-height: 18px;
  transition: color 0.2s ease-out;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
}
.tipLink {
  display: block;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  line-height: 18px;
  transition: color 0.2s ease-out;

  &:hover {
    text-decoration: none;
  }
}
.stub {
  display: flex;
  width: 100%;
  flex-direction: row-reverse;

  span {
    content: '';
    width: 110px;
    height: 7px;
  }
}
</style>
