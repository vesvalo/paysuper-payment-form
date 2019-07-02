<script>
import { includes } from 'lodash-es';

export default {
  name: 'StubPreloaderForm',

  props: {
    layout: {
      type: String,
      default: 'modal',
      validator(value) {
        return includes(['modal', 'page'], value);
      },
    },
  },

  mounted() {
    this.$addCssRules({
      [` 
        .${this.$style.formStubItem}:before,
        .${this.$style.formStubItem}:after,
        .${this.$style.formStubButton} span:before
      `]: {
        'background-color': this.$gui.stubContentColorPrimary,
      },
      [`.${this.$style.formStubButton} span`]: {
        'background-color': this.$gui.buttonBoxColor,
      },
    });
  },
};
</script>

<template>
<div :class="[$style.stubPreloaderForm, $style[`_layout-${layout}`]]">
  <div :class="$style.formStubItems">
    <span
      :class="$style.formStubItem"
      v-for="n in 6"
      :key="n"
    ></span>
  </div>
  <div :class="$style.formStubButton">
    <span></span>
  </div>
</div>
</template>

<style lang="scss" module>
.stubPreloaderForm {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  &._layout-page {
    margin: 60px 0;
  }
}

.formStubItems {
  display: flex;
  flex-direction: column;
  padding: 0 40px;

  .stubPreloaderForm._layout-page & {
    padding: 0;
  }
}

.formStubItem {
  display: flex;
  align-items: center;
  margin-top: 50px;

  &:first-child {
    margin-top: 24px;
  }

  &:before {
    height: 10px;
    width: 100%;
    content: '';
  }

  &:nth-child(3) {
    &:after {
      content: '';
      height: 10px;
      width: 100%;
      margin-left: 20px;
    }
  }

  &:nth-child(6) {
    &:before {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
    &:after {
      content: '';
      height: 10px;
      width: 105px;
      margin-left: 10px;
    }
  }
}

.formStubButton {
  display: flex;
  align-items: flex-end;
  flex-grow: 1;

  span {
    height: 70px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .stubPreloaderForm._layout-page & {
      margin-top: 77px;
      border-radius: 12px;
    }

    &:before {
      width: 100px;
      height: 15px;
      content: '';
    }
  }
}
</style>
