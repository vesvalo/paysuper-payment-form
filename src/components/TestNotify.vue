<script>
export default {
  props: {
    isPageView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      notifyShown: false,
    };
  },
  cssRules() {
    return {
      '.{testNotify}': {
        'background-color': this.$gui.testNotifyBackgroundColor,
        color: this.$gui.testNotifyColor,
      },
      '.{testNotify} svg, .{testNotify} svg:hover': {
        fill: this.$gui.testNotifyColor,
      },
    };
  },
};
</script>

<template>
<div :class="[$style.testNotify, { [$style._isPage]: isPageView }]">
  <div
    :class="$style.testInfo"
    @mouseenter="notifyShown = true"
    @mouseleave="notifyShown = false"
  >
    <IconInfo />
    <UiTip
      innerPosition="center"
      position="bottom"
      width="220px"
      :visible="notifyShown"
    >
      <div v-html="$t('TestNotify.testInfo')"></div>
    </UiTip>
  </div>
  {{ $t('TestNotify.transaction') }}
</div>
</template>

<style module lang="scss">
.testNotify {
  position: absolute;
  top: 0;
  margin: 0 20px;
  width: calc(100% - 40px);
  display: flex;
  height: 28px;
  line-height: 28px;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  font-family: Quicksand;
  z-index: 10;
  border-radius: 0 0 3px 3px;

  &._isPage {
    margin: 0;
    width: 100%;
    top: 3px;
  }
}
.testInfo {
  position: relative;
  display: inline-flex;
  cursor: pointer;
  margin: 0 6px;
}
</style>
