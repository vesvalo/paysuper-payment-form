<script>
import { mapState, mapActions } from 'vuex';
import { gtagEvent } from '@/analytics';
import ActionProcessing from '@/components/ActionProcessing.vue';
import CartSection from '@/components/CartSection.vue';
import FormSection from '@/components/FormSection.vue';
import Modal from '@/components/Modal.vue';
import ModalCart from '@/components/ModalCart.vue';
import ModalForm from '@/components/ModalForm.vue';
import OrderCreationError from '@/components/OrderCreationError.vue';
import VerticalModal from '@/components/VerticalModal.vue';
import VerticalModalCart from '@/components/VerticalModalCart.vue';
import VerticalModalForm from '@/components/VerticalModalForm.vue';
import { postMessage } from './postMessage';

export default {
  components: {
    ActionProcessing,
    CartSection,
    FormSection,
    Modal,
    ModalCart,
    ModalForm,
    OrderCreationError,
    VerticalModal,
    VerticalModalCart,
    VerticalModalForm,
  },

  data() {
    return {
      isVerticalModal: false,
      opened: true,
    };
  },

  computed: {
    ...mapState('PaymentForm', [
      'paymentStatus', 'actionResult', 'orderData', 'isPaymentLoading', 'isFormLoading',
    ]),

    isLoading() {
      return this.paymentStatus === 'INITIAL';
    },

    modalComponentName() {
      return this.isVerticalModal ? 'VerticalModal' : 'Modal';
    },

    modalCartComponentName() {
      return this.isVerticalModal ? 'VerticalModalCart' : 'ModalCart';
    },

    modalFormComponentName() {
      return this.isVerticalModal ? 'VerticalModalForm' : 'ModalForm';
    },
  },

  beforeMount() {
    postMessage('LOADED');
    this.updateIsVerticalModal();
    window.addEventListener('resize', this.updateIsVerticalModal);
  },

  methods: {
    ...mapActions('PaymentForm', ['createOrder', 'setFormLoading']),

    updateIsVerticalModal() {
      this.isVerticalModal = window.innerWidth < 640 || window.innerHeight < 510;
    },

    closeModal() {
      this.opened = false;
      postMessage('MODAL_CLOSED');
      gtagEvent('formClosed');
    },

    async tryToCreateOrder() {
      this.setFormLoading(true);
      await this.createOrder();
      this.setFormLoading(false);
    },
  },
};
</script>

<template>
<div :class="[$style.layout, { [$style._vertical]: isVerticalModal }]">
  <component
    :is="modalComponentName"
    :opened="opened"
    @close="closeModal"
  >
    <template v-if="paymentStatus !== 'FAILED_TO_BEGIN'">
      <component
        :is="modalCartComponentName"
        :isLoading="isLoading"
      >
        <CartSection />
      </component>
      <component
        :is="modalFormComponentName"
        :isLoading="isLoading"
      >
        <FormSection
          :isVerticalModal="isVerticalModal"
          @close="closeModal"
        />
      </component>
    </template>

    <ActionProcessing
      v-if="isPaymentLoading || isFormLoading"
      :content="isFormLoading ? 'no-content' : '3d-security'"
    />
    <OrderCreationError
      v-if="!isFormLoading && paymentStatus === 'FAILED_TO_BEGIN'"
      :message="actionResult.message"
      :type="actionResult.type"
      @tryAgain="tryToCreateOrder"
    />
  </component>
</div>
</template>

<style module lang="scss">
@import '@/assets/styles/reset.scss';

.layout {
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  display: flex;

  &._vertical {
    flex-direction: column;
  }
}
</style>
