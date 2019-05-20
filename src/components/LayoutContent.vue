<template>
<div :class="$style.content">
  <div :class="$style.box">
    <div :class="$style.left">
      <div :class="$style.dummy">
        <div :class="[$style.main, { [$style._opened]: openedContent }]">--- Content ---</div>

        <div :class="$style.total">
          <div>Total</div>
          <div>$112.80</div>
        </div>
      </div>
    </div>

    <div :class="$style.right">
      <div :class="$style.dummy">New Payform</div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    openedContent: {
      default: false,
      type: Boolean,
    },
  },
};
</script>

<style module lang="scss">
@import '@/assets/styles/reset.scss';

.content {
  flex-grow: 1;

  @media screen and (min-width: 640px) {
    display: flex;
  }
}
.box {
  display: flex;
  flex-wrap: wrap;

  @media screen and (min-width: 640px) {
    flex-grow: 1;
  }
}
.left {
  background-color: #f3f3f3;
  display: flex;
  flex-basis: 320px;
  flex-grow: 1;
  justify-content: flex-end;

  @media screen and (min-width: 640px) {
    padding-top: 80px;
    padding-bottom: 80px;
    margin-right: 60px;
    flex-basis: 260px;
  }
}
.right {
  display: flex;
  flex-basis: 320px;
  flex-grow: 1;

  @media screen and (min-width: 640px) {
    padding-top: 80px;
    padding-bottom: 80px;
    margin-left: 60px;
    flex-basis: 260px;
  }
}
.dummy {
  padding: 20px 30px;
  width: 100%;
  max-width: 640px;
  border: 1px dashed rgb(102, 118, 255);

  @media screen and (min-width: 640px) {
    padding: 0;
    max-width: 420px;
  }
}
.main {
  display: none;
  padding-bottom: 12px;
  text-align: center;

  &._opened {
    display: block;
  }

  @media screen and (min-width: 640px) {
    display: block;
  }
}
.total {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  line-height: 20px;
  color: #202226;
  font-weight: bold;
}
</style>
