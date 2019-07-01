<script>
import StubPreloaderCart from '@/components/StubPreloaderCart.vue';
import StubPreloaderForm from '@/components/StubPreloaderForm.vue';

export default {
  name: 'ModalStubPreloader',

  components: {
    StubPreloaderCart,
    StubPreloaderForm,
  },

  mounted() {
    this.$addCssRules({
      [`.${this.$style.cartStub}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.formStub}`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
    });
  },
};
</script>

<template>
<div :class="$style.modalStubPreloader">
  <div :class="$style.cartStub">
    <StubPreloaderCart />
  </div>
  <div :class="$style.formStub">
    <StubPreloaderForm />
  </div>
</div>
</template>

<style lang="scss" module>
.modalStubPreloader {
  display: flex;
}

.cartStub {
  width: 320px;
  height: 100%;
}

.formStub {
  display: flex;
  width: 320px;
  flex-direction: column;
  position: relative;
}
</style>
