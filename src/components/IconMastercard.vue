<template>
<div :class="$style.mastercard">
  <svg width="14" height="9" viewBox="0 0 14 9">
    <circle cx="4.5" cy="4.5" r="4.5" fill="#EB001B"/>
    <circle cx="9.5" cy="4.5" r="4.5" fill="#F79E1B"/>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      fill="#FF5F00"
      d="M7 8.24226C8.20599 7.435 9 6.06025 9 4.50004C9 2.93983 8.20599 1.56507 7 0.757812C5.79401
        1.56507 5 2.93983 5 4.50004C5 6.06025 5.79401 7.435 7 8.24226Z"
    />
  </svg>
</div>
</template>

<style module lang="scss">
.mastercard {
  width: 20px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  background-color: #fff;
}
</style>
