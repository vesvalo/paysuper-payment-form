<template>
<div class="ui-simple-preloader"></div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
$border-width: 4px;
$color: #06eaa7;
$default-position: 45deg;
$main-fill-color: #fff;
$main-color: rgba($main-fill-color, 0.1);
$size: 32px;

.ui-simple-preloader {
  animation: {
    name: rotate;
    duration: 0.8s;
    timing-function: linear;
    iteration-count: infinite;
  };
  background-color: transparent;
  border-color: $main-color;
  border-radius: $size / 2;
  border-style: solid;
  border-top-color: $color;
  border-width: $border-width;
  box-sizing: border-box;
  display: inline-block;
  height: $size;
  transform: rotate($default-position);
  width: $size;
  vertical-align: top;
}

@keyframes rotate {
  100% { transform: rotate(360deg + $default-position) }
}
</style>
