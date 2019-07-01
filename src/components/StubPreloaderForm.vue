<script>
export default {
  name: 'StubPreloaderForm',

  mounted() {
    this.$addCssRules({
      [`
        .${this.$style.formStubHeader}:before,
        .${this.$style.formStubHeader} span,
        .${this.$style.formStubHeader}:after
      `]: {
        'background-color': this.$gui.stubContentColorSecondary,
      },
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
<div :class="$style.stubPreloaderForm">
  <div :class="$style.formStubHeader">
    <span></span>
  </div>
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
  height: 100%;
  display: flex;
  flex-direction: column;
}

.formStubHeader {
  height: 55px;
  display: flex;
  align-items: center;
  padding: 0 20px;

  &:before,
  &:after {
    height: 7px;
    content: '';
  }
  &:before {
    width: 60px;
  }
  span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 0 10px;
  }
  &:after {
    width: 20px;
  }
}

.formStubItems {
  display: flex;
  flex-direction: column;
  padding: 0 40px;
}

.formStubItem {
  display: flex;
  align-items: center;
  margin-top: 50px;

  &:first-child {
    margin-top: 20px;
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

    &:before {
      width: 100px;
      height: 15px;
      content: '';
    }
  }
}
</style>
