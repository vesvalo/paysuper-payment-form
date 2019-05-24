<template>
<div :class="$style.layout">
  <UiButton @click="opened = true">Open modal</UiButton>

  <Modal
    :opened="opened"
    @close="opened = false"
  >
    <ModalCart>
      <CartSection :items="cartTestData" view="promo" />
    </ModalCart>

    <ModalForm>
      <FormSection />
    </ModalForm>
  </Modal>
</div>
</template>

<script>
import CartSection from '@/components/CartSection.vue';
import FormSection from '@/components/FormSection.vue';
import Modal from '@/components/Modal.vue';
import ModalCart from '@/components/ModalCart.vue';
import ModalForm from '@/components/ModalForm.vue';
import cartTestData from './cartTestData';

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
      cartTestData,
      opened: false,
    };
  },
};
</script>


<style module lang="scss">
@import '@/assets/styles/reset.scss';
@import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400,700|Quicksand&subset=cyrillic,cyrillic-ext');

.layout {
  min-height: 100vh;
  width: 100vw;
  font-family: 'Quicksand', 'Comfortaa', sans-serif;
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>
