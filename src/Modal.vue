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
    ...mapState('PaymentForm', ['isLoading']),
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
      <FormSection />
    </ModalForm>

    <ActionProcessing
      :class="$style.preloader"
      v-if="isLoading"
    />
  </Modal>
</div>
</template>


<style module lang="scss">
@import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400,700|Quicksand&subset=cyrillic,cyrillic-ext');
@import '@/assets/styles/reset.scss';

.layout {
  min-height: 100vh;
  width: 100vw;
  font-family: 'Quicksand', 'Comfortaa', sans-serif;
  justify-content: center;
  align-items: center;
  display: flex;
}

.preloader {
  position: absolute;
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
</style>
