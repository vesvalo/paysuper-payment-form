<template>
<div :class="$style.layout">
  <LayoutHeader
    :openedContent="openedContent"
    @toggleContent="openedContent = !openedContent"
  />

  <LayoutContent :openedContent="openedContent"/>

  <LayoutFooter />
</div>
</template>

<script>
import LayoutHeader from './components/LayoutHeader.vue';
import LayoutContent from './components/LayoutContent.vue';
import LayoutFooter from './components/LayoutFooter.vue';

export default {
  components: { LayoutHeader, LayoutContent, LayoutFooter },
  data() {
    return {
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
