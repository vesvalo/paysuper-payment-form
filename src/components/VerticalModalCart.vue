<script>
import StubPreloaderCartModal from '@/components/StubPreloaderCartModal.vue';

export default {
  components: {
    StubPreloaderCartModal,
  },
  props: {
    isLoading: {
      default: false,
      type: Boolean,
    },
  },
  mounted() {
    this.$addCssRules({
      [`.${this.$style.layout}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
    });
  },
};
</script>

<template>
<div :class="$style.layout">
  <UiTransitionFade>
    <StubPreloaderCartModal
      v-if="isLoading"
      :class="$style.stub"
    />
    <div
      v-else
      :class="$style.content"
    >
      <slot />
    </div>
  </UiTransitionFade>
</div>
</template>

<style module lang="scss">
.layout {
  width: 100%;
  max-height: 35vh;
  display: flex;
  flex-direction: column;
  position: relative;
}
.content {
  display: flex;
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
