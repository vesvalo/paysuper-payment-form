<template>
<div :class="$style.layout">
  <div :class="$style.header">
    <a href="#" :class="$style.link">World of Warships</a>
    <a href="#" :class="$style.link">My Profile</a>
  </div>

  <div :class="$style.content">--- Content ---</div>

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

.layout {
  display: flex;
  width: 320px;
  background-color: #333b50;
  padding: 20px;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 0;
}
.link {
  font-size: 12px;
  font-weight: 500;
  color: rgba(#fff, 0.5);
  line-height: 18px;
  text-decoration: none;

  &:hover {
    color: #00d697;
  }

  &:not(:last-child) {
    margin-right: 16px;
  }
}
.content {
  display: flex;
  flex-grow: 1;
  color: rgba(#fff, 0.7);
  padding: 20px 0;
}
.footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 0;
}
</style>
