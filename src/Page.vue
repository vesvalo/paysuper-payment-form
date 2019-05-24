<template>
<div :class="$style.layout">
  <LayoutHeader
    :openedContent="openedContent"
    @toggleContent="openedContent = !openedContent"
  />

  <LayoutContent :openedContent="openedContent">
    <CartSection
      slot="cart"
      :hasPadding="false"
      :items="cartTestData"
    />
    <FormSection slot="form" />
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
import cartTestData from './cartTestData';

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
      cartTestData,
      openedContent: false,
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

  @media screen and (min-width: 640px) {
    background-image: linear-gradient(to right, #f3f3f3 0%, #f3f3f3 50%, #fff 50%, #fff 100%);
  }

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    height: 100vh;
  }
}
</style>
