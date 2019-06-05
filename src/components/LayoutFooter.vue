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
export default {
  mounted() {
    this.$addCssRules({
      [`.${this.$style.left}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.right}`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
      [`.${this.$style.links}:before`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
    });
  },
};
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
  padding: 12px 0 52px;
  width: 100%;
  margin: 0 30px;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    height: 3px;
    left: 0;
    right: 0;
    top: 27px;
  }

  @media screen and (min-width: 640px) {
    margin: 0 0 0 5.5vw;
    padding: 80px 0 50px;
    justify-content: flex-start;
  }

  @media screen and (min-width: 1080px) {
    margin: 0 0 0 60px;
  }
}
.link {
  font-size: 12px;
  font-weight: 500;
  color: #71757a;
  text-decoration: none;
  padding: 8px 0;

  &:hover {
    color: #00d697;
  }

  &:not(:last-child) {
    margin-right: 5vw;

    @media screen and (min-width: 640px) {
      margin-right: 30px;
    }
  }
}
</style>
