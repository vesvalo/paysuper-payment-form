<script>
import { mapState, mapActions } from 'vuex';
import { gtagEvent } from '@/analytics';
import ActionProcessing from '@/components/ActionProcessing.vue';
import Modal from '@/components/Modal.vue';
import ModalCart from '@/components/ModalCart.vue';
import ModalForm from '@/components/ModalForm.vue';
import CartSection from '@/components/CartSection.vue';
import FormSection from '@/components/FormSection.vue';
import OrderCreationError from '@/components/OrderCreationError.vue';
import { postMessage } from './postMessage';

export default {
  components: {
    Modal,
    ModalCart,
    ModalForm,
    CartSection,
    FormSection,
    ActionProcessing,
    OrderCreationError,
  },

  data() {
    return {
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
  },

  beforeMount() {
    postMessage('LOADED');
  },

  methods: {
    ...mapActions('PaymentForm', ['createOrder', 'setFormLoading']),

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
<div :class="$style.layout">
  <Modal
    :opened="opened"
    @close="closeModal"
  >
    <template v-if="paymentStatus !== 'FAILED_TO_BEGIN'">
      <ModalCart
        :isLoading="isLoading"
        :projectName="orderData ? orderData.project.name : ''"
      >
        <CartSection />
      </ModalCart>
      <ModalForm
        :isLoading="isLoading"
      >
        <FormSection @close="closeModal" />
      </ModalForm>
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
  </Modal>
</div>
</template>

<style module lang="scss">
@import '@/assets/styles/reset.scss';

.layout {
  min-height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>
