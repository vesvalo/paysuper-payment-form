<template>
<div :class="$style.layout">
  <UiButton @click="opened = true">Open modal</UiButton>

  <Modal
    :opened="opened"
    @close="opened = false"
  />
</div>
</template>

<script>
import Modal from '@/components/Modal.vue';

export default {
  components: { Modal },
  data() {
    return {
      opened: false,
    };
  },
};
</script>


<style module lang="scss">
@import '@/assets/styles/reset.scss';
@import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400,700|Quicksand&subset=cyrillic,cyrillic-ext');

.layout {
  min-height: 100vh;
  width: 100vw;
  font-family: 'Quicksand', 'Comfortaa', sans-serif;
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>
