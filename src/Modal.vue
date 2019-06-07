<script>
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
  },
  data() {
    return {
      opened: false,
    };
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
</style>
