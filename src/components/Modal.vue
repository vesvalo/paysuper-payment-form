<template>
<transition
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
    <div :class="$style.modal">
      <ModalCart />
      <ModalForm @close="$emit('close')" />
    </div>
  </div>
</transition>
</template>

<script>
import ModalCart from './ModalCart.vue';
import ModalForm from './ModalForm.vue';

export default {
  components: { ModalCart, ModalForm },
  props: {
    opened: {
      default: false,
      type: Boolean,
    },
  },
};
</script>


<style module lang="scss">
@import '@/assets/styles/reset.scss';

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
  display: flex;
  width: 640px;
  min-height: 450px;
  min-width: 480px;
  border-radius: 12px;
  overflow: hidden;
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
