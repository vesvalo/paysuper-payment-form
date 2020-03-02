<template>
<div :class="$style.content">
  <div :class="$style.box">
    <div :class="$style.left">
      <div :class="[$style.mainBox, {[$style._closed]: !isCartOpened}]">
        <div :class="[$style.main, { [$style._hasTestNotify]: isTestTransaction }]">
          <slot name="TestNotify" />
          <StubPreloaderCart
            v-if="isLoading"
            layout="page"
          />
          <slot v-else name="cart" />
        </div>
      </div>
    </div>

    <div :class="$style.right">
      <div :class="$style.mainBox">
        <StubPreloaderForm
          v-if="isLoading"
          layout="page"
        />
        <slot v-else name="form" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import StubPreloaderCart from '@/components/StubPreloaderCart.vue';
import StubPreloaderForm from '@/components/StubPreloaderForm.vue';

export default {
  components: {
    StubPreloaderCart,
    StubPreloaderForm,
  },

  props: {
    isCartOpened: {
      default: true,
      type: Boolean,
    },
    isLoading: {
      default: false,
      type: Boolean,
    },
    isTestTransaction: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.$addCssRules({
      [`.${this.$style.content}`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
      [`.${this.$style.left}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.right}`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
    });
  },
};
</script>

<style module lang="scss">
.content {
  flex-grow: 1;
  width: 100%;

  @media screen and (min-width: 640px) {
    display: flex;
    background-color: none;
  }
}
.box {
  display: flex;
  flex-wrap: wrap;

  @include if-rtl {
    flex-direction: row-reverse;
  }

  @media screen and (min-width: 640px) {
    flex-grow: 1;
  }
}
.left {
  display: flex;
  flex-basis: 320px;
  flex-grow: 1;
  justify-content: flex-end;

  @include if-rtl {
    flex-direction: row-reverse;
  }

  @media screen and (min-width: 640px) {
    padding-right: 5.5vw;
    flex-basis: 260px;

    & > .mainBox {
      padding-left: 5.5vw;
    }
  }

  @media screen and (min-width: 1080px) {
    padding-right: 60px;

    & > .mainBox {
      padding-left: 60px;
    }
  }
}
.right {
  display: flex;
  flex-direction: column;
  flex-basis: 320px;
  flex-grow: 1;

  @include if-rtl {
    align-items: flex-end;
  }

  @media screen and (min-width: 640px) {
    padding-left: 5.5vw;
    flex-basis: 260px;

    & > .mainBox {
      padding-right: 5.5vw;
    }
  }

  @media screen and (min-width: 1080px) {
    padding-left: 60px;

    & > .mainBox {
      padding-right: 60px;
    }
  }
}
.mainBox {
  padding: 20px 30px;
  width: 100%;
  max-width: 640px;

  &._closed {
    padding-top: 0;
    padding-bottom: 0;
  }

  @media screen and (min-width: 640px) {
    padding: 0;
    max-width: 480px;
  }
}
.main {
  position: relative;
  padding-bottom: 12px;

  &._hasTestNotify {
    padding-top: 40px;
  }

  @media screen and (min-width: 640px) {
    display: block;

    &._hasTestNotify {
      padding-top: 0px;
    }
  }
}
</style>
