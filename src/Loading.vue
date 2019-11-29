<script>
import ActionProcessing from '@/components/ActionProcessing.vue';

export default {
  components: {
    ActionProcessing,
  },
};
</script>

<template>
<div :class="$style.layout">
  <ActionProcessing
    type="paymentLoading"
    :class="$style.preloader"
  />
</div>
</template>

<style module lang="scss">
@import '@/assets/styles/reset.scss';

.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  position: relative;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    height: 100vh;
  }
}

.preloader {
  position: fixed;
}
</style>
