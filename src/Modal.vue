<script>
import { mapState } from 'vuex';
import ActionProcessing from '@/components/ActionProcessing.vue';
import CartSection from '@/components/CartSection.vue';
import FormSection from '@/components/FormSection.vue';
import Modal from '@/components/Modal.vue';
import ModalCart from '@/components/ModalCart.vue';
import ModalForm from '@/components/ModalForm.vue';
import { postMessage } from './postMessage';

export default {
  components: {
    CartSection,
    FormSection,
    Modal,
    ModalCart,
    ModalForm,
    ActionProcessing,
  },

  data() {
    return {
      opened: false,
    };
  },

  computed: {
    ...mapState('PaymentForm', ['isPaymentLoading', 'isFormLoading']),
  },

  mounted() {
    postMessage('LOADED');
    this.opened = true;
  },

  methods: {
    closeModal() {
      this.opened = false;
      postMessage('MODAL_CLOSED');
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
    <ModalCart>
      <CartSection />
    </ModalCart>

    <ModalForm>
      <FormSection @close="closeModal" />
    </ModalForm>

    <ActionProcessing
      v-if="isPaymentLoading || isFormLoading"
      :class="$style.preloader"
      :content="isFormLoading ? 'no-content' : '3d-security'"
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
