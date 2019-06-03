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
</div>
</template>

<script>
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
  },
  data() {
    return {
      isCartOpened: true,
    };
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
</style>
