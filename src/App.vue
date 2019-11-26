<script>
import { mapState, mapActions } from 'vuex';
import FastClick from 'fastclick';
import { gtagEvent } from '@/analytics';
import ActionProcessing from '@/components/ActionProcessing.vue';
import CartSection from '@/components/CartSection.vue';
import FormSection from '@/components/FormSection.vue';
import LayoutContent from '@/components/LayoutContent.vue';
import LayoutFooter from '@/components/LayoutFooter.vue';
import LayoutHeader from '@/components/LayoutHeader.vue';
import Modal from '@/components/Modal.vue';
import ModalCart from '@/components/ModalCart.vue';
import ModalForm from '@/components/ModalForm.vue';
import OrderCreationResult from '@/components/OrderCreationResult.vue';
import { postMessage } from './postMessage';

export default {
  components: {
    ActionProcessing,
    CartSection,
    FormSection,
    LayoutContent,
    LayoutFooter,
    LayoutHeader,
    Modal,
    ModalCart,
    ModalForm,
    OrderCreationResult,
  },
  data() {
    return {
      isCartOpened: true,
      isMobile: false,
      layout: this.$layout,
      opened: true,
    };
  },
  computed: {
    ...mapState('PaymentForm', [
      'paymentStatus',
      'actionResult',
      'orderParams',
      'orderData',
      'actionProcessing',
      'currentPlatformId',
    ]),

    isLoading() {
      return this.paymentStatus === 'INITIAL';
    },
    isPageView() {
      return this.layout === 'page';
    },
    isModalEssence() {
      return this.$layout === 'modal';
    },
    wrapperComponentName() {
      if (!this.isPageView) {
        return 'Modal';
      }
      return this.isMobile ? 'div' : 'UiScrollbarBox';
    },
  },
  created() {
    this.$addCssRules({
      [`.${this.$style.iconClose}`]: {
        fill: this.$gui.modalCloseIconColor,
      },
      [`.${this.$style.close}:hover > .${this.$style.iconClose}`]: {
        fill: this.$gui.baseHoverColor,
      },
    });
  },
  beforeMount() {
    postMessage('LOADED');

    // Delete touch latency for mobile devices
    window.addEventListener('DOMContentLoaded', () => {
      FastClick.attach(document.body);
    }, false);

    this.updateLayout();
    window.addEventListener('resize', this.updateLayout);
  },
  methods: {
    ...mapActions('PaymentForm', ['changePlatform', 'recreateOrder']),

    updateLayout() {
      this.isMobile = window.innerWidth < 640 || window.innerHeight < 510;

      if (this.isMobile) {
        this.layout = 'page';
      } else {
        this.layout = this.$layout;
      }
    },
    closeForm() {
      if (this.isModalEssence) {
        this.opened = false;
        postMessage('MODAL_CLOSED');
        gtagEvent('formClosed');
      } else {
        let redirectUrl;
        if (this.paymentStatus === 'COMPLETED') {
          redirectUrl = this.orderData.project.url_success;
        } else {
          redirectUrl = this.orderData.project.url_fail;
        }
        if (redirectUrl) {
          window.location.replace(redirectUrl);
        }
      }
    },
  },
};
</script>

<template>
<div :class="[
  $style.layout,
  { [$style._isPage]: isPageView, [$style._isMobile]: isMobile },
]">
  <component
    v-if="opened"
    :is="wrapperComponentName"
    :class="$style.wrapper"
    :opened="opened"
    :isUpdateOnClick="true"
    :settings="{ suppressScrollX: true }"
    @close="closeForm"
  >
    <template v-if="paymentStatus !== 'FAILED_TO_BEGIN'">
      <template v-if="isPageView">
        <LayoutHeader
          :isCartOpened="isCartOpened"
          :isModal="isModalEssence"
          :projectName="orderData ? orderData.project.name : ''"
          :isLoading="isLoading"
          :isMobile="isMobile"
          @toggleCart="isCartOpened = !isCartOpened"
        />

        <LayoutContent
          :isCartOpened="isCartOpened"
          :isLoading="isLoading"
        >
          <CartSection
            slot="cart"
            :orderData="orderData"
            :isCartOpened="isCartOpened"
            :isPageView="isPageView"
            :hasPlatformSelect="orderParams.type === 'key'"
            :currentPlatformId="currentPlatformId"
            @changePlatform="changePlatform"
          />
          <FormSection
            slot="form"
            :isPageView="isPageView"
            @close="closeForm"
          />
        </LayoutContent>

        <LayoutFooter :isLoading="isLoading"/>
      </template>
      <template v-else>
        <ModalCart
          :projectName="orderData ? orderData.project.name : ''"
          :isLoading="isLoading"
        >
          <CartSection
            :orderData="orderData"
            :hasPlatformSelect="orderParams.type === 'key'"
            :currentPlatformId="currentPlatformId"
            @changePlatform="changePlatform"
          />
        </ModalCart>
        <ModalForm :isLoading="isLoading">
          <FormSection @close="closeForm"/>
        </ModalForm>
      </template>
    </template>

    <ActionProcessing
      v-if="actionProcessing && !isPageView"
      v-bind="actionProcessing"
    />
    <OrderCreationResult
      v-if="paymentStatus === 'FAILED_TO_BEGIN'"
      v-bind="actionResult"
      :class="$style.orderCreationError"
      :isModal="isModalEssence"
      @tryAgain="recreateOrder"
    />

    <div
      v-if="isModalEssence"
      :class="$style.close"
      @click="closeForm"
    >
      <IconClose :class="$style.iconClose" />
    </div>
  </component>

  <ActionProcessing
    v-if="actionProcessing && isPageView"
    v-bind="actionProcessing"
  />
</div>
</template>

<style module lang="scss">
@import '@/assets/styles/reset.scss';
@import '@/assets/styles/fonts.scss';

.layout {
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  word-break: keep-all;
  hyphens: none;

  &._isMobile {
    touch-action: manipulation;
  }

  &._isPage {
    display: flex;
    min-height: 100vh;
    width: 100%;
    flex-direction: column;

    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      height: 100vh;
    }

    .preloader {
      position: fixed;
    }

    .orderCreationError {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
    }

    .wrapper {
      min-height: 100%;
      min-height: 100vh;
      width: 100%;
      width: 100vw;
      display: flex;
      flex-direction: column;

      .layout._isMobile & {
        flex-direction: row;
        flex-wrap: wrap;
      }

      @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
        height: 100vh;
      }
    }
  }
}

.close {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  z-index: 10000;
  height: 54px;
  width: 54px;
  display: flex;
  align-items: center;
  justify-content: center;

  .layout._isPage & {
    height: 60px;
    width: 60px;
  }

  &:hover > .iconClose {
    transform: rotate(360deg);
  }
}
.iconClose {
  width: 12px;
  height: 12px;
  transition: transform 0.3s ease-out 0.3s;
}
</style>
