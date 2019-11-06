<script>
import { mapState, mapActions } from 'vuex';
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
import OrderCreationError from '@/components/OrderCreationError.vue';
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
    OrderCreationError,
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

    this.updateLayout();
    window.addEventListener('resize', this.updateLayout);
  },
  methods: {
    ...mapActions('PaymentForm', ['changePlatform']),

    updateLayout() {
      this.isMobile = window.innerWidth < 640 || window.innerHeight < 510;

      if (this.isMobile) {
        this.layout = 'page';

        this.$nextTick(() => {
          this.$refs.wrapper.update();
        });
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

    tryToBeginAgain() {
      postMessage('TRY_TO_BEGIN_AGAIN');
      window.location.reload();
    },
  },
};
</script>

<template>
<div :class="[$style.layout, { [$style._isPage]: isPageView }]">
  <component
    v-if="opened"
    :is="isPageView ? 'UiScrollbarBox' : 'Modal'"
    ref="wrapper"
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
          :isPageView="isPageView"
          :projectName="orderData ? orderData.project.name : ''"
          :isLoading="isLoading"
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
      v-if="actionProcessing"
      v-bind="actionProcessing"
    />
    <OrderCreationError
      v-if="paymentStatus === 'FAILED_TO_BEGIN'"
      v-bind="actionResult"
      :class="$style.orderCreationError"
      :isModal="isModalEssence"
      @tryAgain="tryToBeginAgain"
    />

    <div
      v-if="isModalEssence"
      :class="$style.close"
      @click="closeForm"
    >
      <IconClose :class="$style.iconClose" />
    </div>
  </component>
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
      position: fixed;
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
