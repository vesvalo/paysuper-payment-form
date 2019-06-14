<template>
<transition
  appear
  :enter-class="$style.enter"
  :enter-active-class="$style.enterActive"
  :enter-to-class="$style.enterTo"
  :leave-class="$style.leave"
  :leave-active-class="$style.leaveActive"
  :leave-to-class="$style.leaveTo"
>
  <div
    v-show="opened"
    :class="$style.layout"
  >
    <div
      :class="$style.modal"
      :style="modalStyles"
    >
      <slot />

      <div
        :class="$style.close"
        @click="$emit('close')"
      >
        <IconClose :class="$style.iconClose" />
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  props: {
    maxHeight: {
      default: '510px',
      type: String,
    },
    maxWidth: {
      default: '640px',
      type: String,
    },
    minHeight: {
      default: '450px',
      type: String,
    },
    minWidth: {
      default: '480px',
      type: String,
    },
    opened: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    modalStyles() {
      return {
        'max-height': this.maxHeight,
        'max-width': this.maxWidth,
        'min-height': this.minHeight,
        'min-width': this.minWidth,
      };
    },
  },
};
</script>

<style module lang="scss">
.layout {
  align-items: center;
  background-color: rgba(#000, 0.7);
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 10000;
}
.modal {
  position: relative;
  display: flex;
  width: 640px;
  height: 510px;
  min-width: 480px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #424c66;

  @include if-rtl {
    flex-direction: row-reverse;
  }
}
.close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
  cursor: pointer;

  &:hover > .iconClose {
    fill: #00d697;
  }
}
.iconClose {
  fill: rgba(#fff, 0.5);
}
.enter,
.leaveTo {
  opacity: 0;
  transform: scale(1.2);
}
.enterTo,
.leave {
  opacity: 1;
  transform: scale(1);
}
.enterActive,
.leaveActive {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}
</style>
