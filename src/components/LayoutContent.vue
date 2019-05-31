<template>
<div :class="$style.content">
  <div :class="$style.box">
    <div :class="$style.left">
      <div :class="$style.mainBox">
        <div :class="[$style.main, { [$style._opened]: openedContent }]">
          <slot name="cart" />
        </div>
      </div>
    </div>

    <div :class="$style.right">
      <div :class="$style.mainBox">
        <slot name="form" />
      </div>
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
  background-color: #333b50;
  display: flex;
  flex-basis: 320px;
  flex-grow: 1;
  justify-content: flex-end;

  @media screen and (min-width: 640px) {
    padding-top: 80px;
    padding-bottom: 80px;
    margin-right: 5.5vw;
    flex-basis: 260px;

    & > .mainBox {
      margin-left: 5.5vw;
    }
  }

  @media screen and (min-width: 1080px) {
    margin-right: 60px;

    & > .mainBox {
      margin-left: 5.5vw;
    }
  }
}
.right {
  display: flex;
  flex-basis: 320px;
  flex-grow: 1;
  background-color: #424c66;

  @media screen and (min-width: 640px) {
    padding-top: 80px;
    padding-bottom: 80px;
    margin-left: 5.5vw;
    flex-basis: 260px;

    & > .mainBox {
      margin-right: 5.5vw;
    }
  }

  @media screen and (min-width: 1080px) {
    margin-left: 60px;

    & > .mainBox {
      margin-right: 60px;
    }
  }
}
.mainBox {
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

  &._opened {
    display: block;
  }

  @media screen and (min-width: 640px) {
    display: block;
  }
}
</style>
