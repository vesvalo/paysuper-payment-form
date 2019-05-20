<template>
<div :class="$style.header">
  <div :class="$style.left">
    <div :class="$style.inner">
      <div :class="$style.game">World of Warships</div>
      <div
        :class="[$style.wrap, { [$style._opened]: openedContent }]"
        @click="toggleContent"
      >
        <IconArrow />
      </div>
      <div :class="[$style.additional, { [$style._opened]: openedContent }]">
        <div :class="$style.id">id897632299</div>
        <div :class="$style.terms">Terms of Use</div>
      </div>
    </div>
  </div>

  <div :class="$style.right">
    <div :class="$style.inner">
      <div :class="$style.title">Pay Super</div>
      <div :class="$style.icons">
        <IconSupport color="#71757a" />
        <div :class="$style.lang">EN</div>
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
  methods: {
    toggleContent() {
      this.$emit('toggleContent');
    },
  },
};
</script>

<style module lang="scss">
@import '@/assets/styles/reset.scss';

.header {
  display: flex;
  flex-grow: 0;
  flex-wrap: wrap-reverse;
  z-index: 1;
}
.left {
  background-color: #f3f3f3;
  display: flex;
  flex-basis: 320px;
  flex-grow: 1;
  flex-wrap: wrap;

  & > .inner {
    padding: 30px 30px 15px;
    box-shadow: 0px 31px 0px -30px #dfdfdf;
  }

  @media screen and (min-width: 640px) {
    margin-right: 60px;
    flex-basis: 260px;
    box-shadow: 0px 3px 0px 0px #fff;
    justify-content: flex-end;
    height: auto;

    & > .inner {
      padding: 100px 0px 40px;
      box-shadow: none;
    }
  }
}
.right {
  display: flex;
  flex-basis: 320px;
  flex-grow: 1;
  height: 130px;
  justify-content: flex-end;

  & > .inner {
    padding: 40px 30px 25px;
  }

  @media screen and (min-width: 640px) {
    margin-left: 60px;
    flex-basis: 260px;
    box-shadow: 0px 3px 0px 0px #f3f3f3;
    justify-content: flex-start;
    height: auto;

    & > .inner {
      padding: 100px 0px 40px;
    }
  }
}
.inner {
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-end;

  @media screen and (min-width: 640px) {
    max-width: 420px;
  }
}
.game {
  line-height: 24px;
  height: 24px;
  font-size: 16px;
  font-weight: bold;
  color: #202226;

  @media screen and (min-width: 640px) {
    line-height: 40px;
    height: 40px;
    font-size: 20px;
  }
}
.additional {
  display: none;
  font-size: 12px;
  font-weight: 500;
  color: #71757a;
  line-height: 18px;

  &._opened {
    display: flex;
    width: 100%;
    padding-top: 12px;
  }

  @media screen and (min-width: 640px) {
    display: flex;
    line-height: 40px;
    height: 40px;
    justify-content: space-between;
  }
}
.id {
  margin-right: 20px;
}
.wrap {
  cursor: pointer;
  height: 24px;
  line-height: 24px;

  &._opened {
    & > svg {
      transform: rotateX(180deg);
    }
  }

  @media screen and (min-width: 640px) {
    display: none;
  }
}
.title {
  font-size: 30px;
  line-height: 40px;
  height: 40px;
  font-weight: bold;
  color: #5b88de;
}
.icons {
  display: flex;
  line-height: 40px;
  height: 40px;
  align-items: center;
}
.lang {
  margin-left: 10px;
  font-size: 12px;
  color: #71757a;
  cursor: pointer;
  line-height: 15px;
  height: 15px;

  &:hover {
    color: #06eaa7;
  }
}
</style>
