<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';

export default {
  props: {
    settings: {
      type: Object,
    },
  },
  components: {
    VuePerfectScrollbar,
  },
};
</script>

<template>
<VuePerfectScrollbar class="ui-scrollbar-box" :settings="settings">
  <slot></slot>
</VuePerfectScrollbar>
</template>

<style lang="scss">
.ui-scrollbar-box {
  &.ps:hover > .ps__scrollbar-y-rail:hover,
  &.ps:hover.ps--in-scrolling.ps--y > .ps__scrollbar-y-rail,
  &.ps.ps--in-scrolling.ps--y > .ps__scrollbar-y-rail {
    background-color: transparent;

    & > .ps__scrollbar-y {
      width: 3px;
      background-color: rgba(0, 0, 0, 0.7);
    }
  }

  &.ps > .ps__scrollbar-y-rail > .ps__scrollbar-y {
    background-color: rgba(0, 0, 0, 0.7);
    width: 3px;
    right: 5px;
    border-radius: 4px;
  }
}
</style>
