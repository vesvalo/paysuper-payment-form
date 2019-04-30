<script>
import UiButton from './components/UiButton.vue';

export default {
  components: { UiButton },
  data() {
    return {
      hasClick: false,
    };
  },
  methods: {
    clickHandler() {
      this.hasClick = !this.hasClick;
    },
  },
};
</script>

<template>
<div class="sandbox">
  <h1>
    Sandbox is here
  </h1>

  <div class="ui-kit">
    <UiButton @click="clickHandler" :disabled="true">
      <template v-if="hasClick" slot="before">Before</template>
      Text for button
      <template v-if="!hasClick" slot="after">After</template>
    </UiButton>
  </div>
</div>
</template>

<style lang="scss">
@import "@/assets/styles/reset.scss";

.sandbox {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.ui-kit {
  width: 100vw;
  flex-grow: 1;
  background-color: #424c66;
  padding: 20px 50px;
}
</style>
