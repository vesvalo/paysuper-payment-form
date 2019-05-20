<template>
<div :class="$style.footer">
  <div :class="$style.left"></div>
  <div :class="$style.right">
    <div :class="$style.links">
      <a href="#" :class="$style.link">User Agreement</a>
      <a href="#" :class="$style.link">Refund Policy</a>
      <a href="#" :class="$style.link">Support</a>
    </div>
  </div>
</div>
</template>

<script>
export default {};
</script>

<style module lang="scss">
@import '@/assets/styles/reset.scss';

.footer {
  display: flex;
  flex-grow: 0;
}
.left {
  @media screen and (min-width: 640px) {
    width: 100%;
  }
}
.right {
  display: flex;
  width: 100%;
}
.links {
  display: flex;
  line-height: 18px;
  padding: 20px 0px 60px;
  box-shadow: 0px -3px 0px 0px #f3f3f3;
  width: 100%;
  margin: 0 30px;
  flex-wrap: wrap;

  @media screen and (min-width: 640px) {
    margin: 0px 0px 0px 60px;
    padding: 50px 0px;
  }
}
.link {
  font-size: 12px;
  font-weight: 500;
  color: #71757a;
  text-decoration: none;

  &:hover {
    color: #00d697;
  }

  &:not(:last-child) {
    margin-right: 30px;
  }
}
</style>
