<script>
import StubPreloaderForm from '@/components/StubPreloaderForm.vue';

export default {
  name: 'StubPreloaderFormModal',

  components: {
    StubPreloaderForm,
  },

  mounted() {
    this.$addCssRules({
      [`
        .${this.$style.formStubHeader}:before,
        .${this.$style.formStubHeader} span,
        .${this.$style.formStubHeader}:after
      `]: {
        'background-color': this.$gui.stubContentColorSecondary,
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
  <StubPreloaderForm />
</div>
</template>

<style lang="scss" module>
.stubPreloaderForm {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
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
</style>
