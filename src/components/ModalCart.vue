<template>
<div :class="$style.layout">
  <div :class="$style.header">
    <a href="#" :class="$style.link">World of Warships</a>
    <a href="#" :class="$style.link">My Profile</a>
  </div>

  <div :class="$style.content">
    <UiScrollbarBox>
      <slot />
    </UiScrollbarBox>
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
  display: flex;
  width: 320px;
  background-color: #333b50;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 0;
  padding: 20px;
}
.link {
  font-size: 12px;
  font-weight: 500;
  color: rgba(#fff, 0.5);
  text-decoration: none;
  line-height: 20px;

  &:hover {
    color: #00d697;
  }
}
.content {
  display: flex;
  flex-grow: 1;
  color: rgba(#fff, 0.7);
  max-height: calc(100% - 120px);
}
.footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 0;
  padding: 20px;

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
