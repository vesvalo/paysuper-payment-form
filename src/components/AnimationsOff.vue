<template>
<div class="animations-off">
<slot></slot>
</div>
</template>

<style lang="scss" scoped>
.animations-off {
  /deep/ {
    * {
      &,
      &::before,
      &::after {
        transition: none !important;
        animation: none !important;
      }
    }
  }
}
</style>
