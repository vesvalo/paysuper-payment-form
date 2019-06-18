<template>
<div :class="$style.layout">
  <LayoutHeader
    :isCartOpened="isCartOpened"
    @toggleCart="isCartOpened = !isCartOpened"
  />

  <LayoutContent :isCartOpened="isCartOpened">
    <CartSection
      slot="cart"
      layout="page"
      :isCartOpened="isCartOpened"
    />
    <FormSection
      slot="form"
      layout="page"
    />
  </LayoutContent>

  <LayoutFooter />

  <ActionProcessing
    v-if="isPaymentLoading || isFormLoading"
    :class="$style.preloader"
    :content="isFormLoading ? 'no-content' : '3d-security'"
  />
</div>
</template>

<script>
import { mapState } from 'vuex';
import ActionProcessing from '@/components/ActionProcessing.vue';
import CartSection from '@/components/CartSection.vue';
import FormSection from '@/components/FormSection.vue';
import LayoutHeader from '@/components/LayoutHeader.vue';
import LayoutContent from '@/components/LayoutContent.vue';
import LayoutFooter from '@/components/LayoutFooter.vue';

export default {
  components: {
    CartSection,
    FormSection,
    LayoutHeader,
    LayoutContent,
    LayoutFooter,
    ActionProcessing,
  },
  data() {
    return {
      isCartOpened: true,
    };
  },
  computed: {
    ...mapState('PaymentForm', ['isPaymentLoading', 'isFormLoading']),
  },
};
</script>


<style module lang="scss">
@import '@/assets/styles/reset.scss';
@import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400,700|Quicksand&subset=cyrillic,cyrillic-ext');

.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Quicksand', 'Comfortaa', sans-serif;
  flex-direction: column;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    height: 100vh;
  }
}

.preloader {
  position: fixed;
}
</style>
