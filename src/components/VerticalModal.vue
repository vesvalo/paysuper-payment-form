<script>
import LocaleChanger from '@/components/LocaleChanger.vue';
import VerticalModalHeader from '@/components/VerticalModalHeader.vue';

export default {
  components: {
    LocaleChanger,
    VerticalModalHeader,
  },
  props: {
    opened: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      hasLocaleChangerOpened: false,
    };
  },
};
</script>

<template>
<UiTransitionFade>
  <div
    v-show="opened"
    :class="$style.layout"
  >
    <VerticalModalHeader
      :hasLocaleChangerOpened="hasLocaleChangerOpened"
      @toggleLocaleChanger="hasLocaleChangerOpened = !hasLocaleChangerOpened"
      @close="$emit('close')"
    />

    <div :class="$style.content">
      <slot />

      <LocaleChanger
        v-if="hasLocaleChangerOpened"
        :class="$style.localeChanger"
        @changeLocale="hasLocaleChangerOpened = false"
      />
    </div>
  </div>
</UiTransitionFade>
</template>

<style module lang="scss">
.layout {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  overflow: hidden;
  background-color: #424c66;
  z-index: 10000;
  flex-grow: 1;
}
.content {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: calc(100% - 50px);
  position: relative;
  width: 100%;
  align-items: center;
}
.localeChanger {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
}
</style>
