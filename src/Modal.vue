<script>
import { mapState, mapActions } from 'vuex';
import ActionProcessing from '@/components/ActionProcessing.vue';
import CartSection from '@/components/CartSection.vue';
import FormSection from '@/components/FormSection.vue';
import Modal from '@/components/Modal.vue';
import ModalCart from '@/components/ModalCart.vue';
import ModalForm from '@/components/ModalForm.vue';
import OrderCreationError from '@/components/OrderCreationError.vue';
import ModalStubPreloader from '@/components/ModalStubPreloader.vue';
import { postMessage } from './postMessage';

export default {
  components: {
    CartSection,
    FormSection,
    Modal,
    ModalCart,
    ModalForm,
    ActionProcessing,
    OrderCreationError,
    ModalStubPreloader,
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
  },

  beforeMount() {
    postMessage('LOADED');
  },

  methods: {
    ...mapActions('PaymentForm', ['createOrder', 'setFormLoading']),

    closeModal() {
      this.opened = false;
      postMessage('MODAL_CLOSED');
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
    <ModalStubPreloader
      v-if="paymentStatus === 'INITIAL'"
    />
    <template
      v-if="paymentStatus === 'NEW'"
    >
      <ModalCart :projectName="orderData.project.name">
        <CartSection />
      </ModalCart>

      <ModalForm>
        <FormSection @close="closeModal" />
      </ModalForm>
    </template>

    <ActionProcessing
      v-if="isPaymentLoading || isFormLoading"
      :content="isFormLoading ? 'no-content' : '3d-security'"
    />
    <OrderCreationError
      v-if="paymentStatus === 'FAILED_TO_BEGIN'"
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
