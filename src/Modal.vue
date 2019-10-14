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
import VerticalCartSection from '@/components/VerticalCartSection.vue';
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
    VerticalCartSection,
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

    getComponentName() {
      return name => (this.isVerticalModal ? `Vertical${name}` : name);
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
    :is="getComponentName('Modal')"
    :opened="opened"
    @close="closeModal"
  >
    <template v-if="paymentStatus !== 'FAILED_TO_BEGIN'">
      <component
        :is="getComponentName('ModalCart')"
        projectName="PaySuper"
        :isLoading="isLoading"
      >
        <component
          :is="getComponentName('CartSection')"
          :orderData="orderData"
        />
      </component>
      <component
        :is="getComponentName('ModalForm')"
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
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;

  &._vertical {
    flex-direction: column;
  }
}
</style>
