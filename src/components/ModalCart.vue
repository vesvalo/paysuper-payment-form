<script>
import StubPreloaderCartModal from '@/components/StubPreloaderCartModal.vue';
import { gtagEvent } from '@/analytics';

export default {
  components: {
    StubPreloaderCartModal,
  },
  props: {
    projectName: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isTestTransaction: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isProfileShown: false,
    };
  },
  cssRules() {
    return {
      '.{layout}': {
        'background-color': this.$gui.cartBackgroundColor,
      },
      '.{link}, .{projectName}': {
        color: this.$gui.layoutTextColor,
      },
      '.{link}:hover, .{link}:hover > svg': {
        color: this.$gui.baseHoverColor,
      },
      '.{link} > svg': {
        fill: this.$gui.layoutTextColor,
      },
      '.{link}:hover > svg': {
        fill: this.$gui.baseHoverColor,
      },
      '.{tipLink}': {
        color: this.$gui.tipLinkColor,
      },
      '.{tipLink}:hover': {
        color: this.$gui.baseHoverColor,
      },
      '.{header}': {
        'background-image': `
          linear-gradient(
            180deg,
            ${this.$gui.cartBackgroundColor} 51.5%,
            ${this.$gui.cartBoxShadowColor} 100%
          )
        `,
      },
      '.{footer}': {
        'background-image': `
          linear-gradient(
            180deg,
            ${this.$gui.cartBoxShadowColor} 0%,
            ${this.$gui.cartBackgroundColor} 60%
          )
        `,
      },
    };
  },
  methods: {
    fireAnalyticsEvent(elementName) {
      gtagEvent(`click${elementName}Link`, { event_category: 'userAction' });
    },
  },
};
</script>

<template>
<div :class="$style.layout">
  <UiTransitionFade>
    <StubPreloaderCartModal
      v-if="isLoading"
      :class="$style.stub"
    />
    <div
      v-else
      :class="$style.wrapper"
    >
      <slot name="testNotificationBlock" />
      <div :class="[$style.header, { [$style._hasTestNotificationBlock]: isTestTransaction }]">
        <span
          :class="$style.projectName"
          :title="projectName"
          @click="fireAnalyticsEvent('Project')"
        >{{ projectName }}</span>
        <span
          :class="[$style.link, $style._head]"
          @mouseenter="isProfileShown = true"
          @mouseleave="isProfileShown = false"
        >
          {{ $t('ModalCart.legalInfo') }}
          <IconArrow :class="$style.arrow" />
          <UiTip
            innerPosition="right"
            position="bottom"
            width="280px"
            :visible="isProfileShown"
          >
            <a
              :class="$style.tipLink"
              href="https://pay.super.com/policy/eula"
              target="_blank"
              @click="fireAnalyticsEvent('UserAgreement')"
            >
              {{ $t('ModalCart.userAgreement') }}
            </a>
            <a
              :class="$style.tipLink"
              href="https://pay.super.com/policy/tou"
              target="_blank"
              @click="fireAnalyticsEvent('TermsOfUse')"
            >
              {{ $t('ModalCart.termsOfUse') }}
            </a>
            <!-- @TODO: return this items after recovery our support services
            <a
              :class="$style.tipLink"
              href="http://help.pay.super.com"
              target="_blank"
              @click="fireAnalyticsEvent('Support')"
            >
              {{ $t('ModalCart.support') }}
            </a>
            -->
          </UiTip>
        </span>
        <!-- <span
          :class="$style.link"
          @mouseenter="isProfileShown = true"
          @mouseleave="isProfileShown = false"
        >
          {{ $t('ModalCart.profile') }}
          <UiTip
            innerPosition="right"
            position="bottom"
            width="200px"
            :visible="isProfileShown"
          >
            <a
              href="#"
              :class="$style.tipLink"
              @click="fireAnalyticsEvent('PurchaseInformation')"
            >{{ $t('ModalCart.purchaseInformation') }}</a>
            <a
              href="#"
              :class="$style.tipLink"
              @click="fireAnalyticsEvent('PaymentManagement')"
            >{{ $t('ModalCart.paymentManagement') }}</a>
          </UiTip>
        </span> -->
      </div>

      <div :class="[$style.content, { [$style._hasTestNotificationBlock]: isTestTransaction }]">
        <slot />
      </div>

      <div :class="$style.footer"></div>
    </div>
  </UiTransitionFade>
</div>
</template>

<style module lang="scss">
.layout {
  width: 320px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.wrapper {
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

  &._hasTestNotificationBlock {
    top: 28px;
  }
}
.projectName {
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.link {
  position: relative;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  line-height: 18px;
  transition: color 0.2s ease-out;
  cursor: pointer;
  white-space: nowrap;

  &._head {
    margin-left: 8px;

    @include if-rtl {
      margin-left: 0;
      margin-right: 8px;
    }
  }

  &:hover {
    text-decoration: none;
  }
}
.arrow {
  width: 10px;
  margin: 0 0 0 6px;
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
.content {
  display: flex;
  z-index: 1;
  position: relative;
  width: 100%;

  &._hasTestNotificationBlock {
    padding-top: 28px;
  }
}
.footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0 0;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}
</style>
