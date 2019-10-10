<script>
import StubPreloaderCartVerticalModal from '@/components/StubPreloaderCartVerticalModal.vue';

export default {
  components: {
    StubPreloaderCartVerticalModal,
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
    <template>
      <StubPreloaderCartVerticalModal
        v-if="true"
        :class="$style.stub"
      />
      <div
        v-else
        :class="$style.content"
      >
        <slot />
      </div>
    </template>
  </UiTransitionFade>
</div>
</template>

<style module lang="scss">
.layout {
  width: 100%;
  min-height: 40%;
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
