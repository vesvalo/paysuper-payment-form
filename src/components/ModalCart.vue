<template>
<div :class="$style.layout">
  <div :class="$style.header">
    <a href="#" :class="$style.link">World of Warships</a>
    <a href="#" :class="$style.link">My Profile</a>
  </div>

  <div :class="$style.content">
    <slot/>
  </div>

  <div :class="$style.footer">
    <a href="#" :class="$style.link">Terms of Use</a>
    <a href="#" :class="$style.link">Support</a>
  </div>
</div>
</template>

<script>
export default {};
</script>


<style module lang="scss">
@import '@/assets/styles/reset.scss';
@import '@/assets/styles/directional.scss';

.layout {
  width: 320px;
  min-height: 100%;
  background-color: #333b50;
  position: relative;
  display: flex;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
}
.link {
  font-size: 12px;
  font-weight: 500;
  color: rgba(#fff, 0.7);
  line-height: 18px;
  text-decoration: none;
  line-height: 20px;

  &:hover {
    color: #00d697;
  }
}
.content {
  display: flex;
  color: rgba(#fff, 0.7);
  z-index: 1;
  position: relative;
  width: 100%;
}
.footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;

  & > .link {
    @include if-ltr {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }

    @include if-rtl {
      &:not(:last-child) {
        margin-left: 16px;
      }
    }
  }
}
</style>
