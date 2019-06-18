<template>
<div :class="$style.container"></div>
</template>

<script>
export default {
  computed: {
    container() {
      return this.$style.container;
    },
  },
  mounted() {
    this.$addCssRules({
      [`.${this.container}`]: {
        'border-color': this.$gui.preloaderColor,
        'border-top-color': this.$gui.preloaderSpinColor,
      },
    });
  },
};
</script>

<style module lang="scss">
$border-width: 4px;
$default-position: 45deg;
$size: 32px;

.container {
  animation: {
    name: rotate;
    duration: 0.8s;
    timing-function: linear;
    iteration-count: infinite;
  }

  background-color: transparent;
  border-radius: $size / 2;
  border-style: solid;
  border-width: $border-width;
  box-sizing: border-box;
  display: inline-block;
  height: $size;
  transform: rotate($default-position);
  width: $size;
  vertical-align: top;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg + $default-position);
  }
}
</style>
