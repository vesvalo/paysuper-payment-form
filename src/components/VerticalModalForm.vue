<script>
import StubPreloaderFormModal from '@/components/StubPreloaderFormModal.vue';

export default {
  components: {
    StubPreloaderFormModal,
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
        'background-color': this.$gui.formBackgroundColor,
      },
    });
  },
};
</script>

<template>
<div :class="$style.layout">
  <UiTransitionFade>
    <StubPreloaderFormModal
      v-if="isLoading"
      :class="$style.stub"
    />
    <div
      v-if="!isLoading"
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
  display: flex;
  flex-direction: column;
  position: relative;
  flex-grow: 1;
  height: 100%;
}
.stub {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  flex-grow: 1;
  height: 100%;
}
.content {
  display: flex;
  flex-grow: 1;
  position: relative;
  height: 100%;
}
</style>
