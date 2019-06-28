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
      opened: true,
    };
  },

  computed: {
    ...mapState('PaymentForm', ['orderData', 'isPaymentLoading', 'isFormLoading']),
  },

  beforeMount() {
    postMessage('LOADED');
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
    <transition
      v-if="orderData"
      appear
      :enter-class="$style.enter"
      :enter-active-class="$style.enterActive"
      :enter-to-class="$style.enterTo"
      :leave-class="$style.leave"
      :leave-active-class="$style.leaveActive"
      :leave-to-class="$style.leaveTo"
    >
      <div :class="$style.transitionContainer">
        <ModalCart :projectName="orderData.project.name">
          <CartSection />
        </ModalCart>

        <ModalForm>
          <FormSection @close="closeModal" />
        </ModalForm>
      </div>
    </transition>

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

.transitionContainer {
  display: flex;
}

.enter,
.leaveTo {
  opacity: 0;
}
.enterTo,
.leave {
  opacity: 1;
}
.enterActive,
.leaveActive {
  transition: opacity 0.15s ease-in-out;
}
</style>
