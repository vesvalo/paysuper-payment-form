<script>
import UiButton from './components/UiButton.vue';
import UiCheckbox from './components/UiCheckbox.vue';
import UiTextField from './components/UiTextField.vue';

export default {
  components: { UiButton, UiCheckbox, UiTextField },
  data() {
    return {
      hasClick: false,
      check: false,
      value: '',
      disabled: false,
      hasError: false,
    };
  },
  methods: {
    clickHandler() {
      this.hasClick = !this.hasClick;
    },
    checkHandler(value) {
      this.check = value;
    },
    inputHandler(value) {
      this.value = value;
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
    <UiButton
      class="ui-item"
      @click="clickHandler"
      :disabled="true"
    >
      <template v-if="hasClick" slot="before">Before</template>
      Text for button
      <template v-if="!hasClick" slot="after">After</template>
    </UiButton>
    <UiCheckbox
      v-model="check"
      class="ui-item"
      @input="checkHandler"
    >
      Label for checkbox
    </UiCheckbox>
    <div class="ui-item">
      <UiTextField
        v-model="value"
        class="text-input"
        label="Label"
        errorText="Some error text"
        :disabled="disabled"
        :hasError="hasError"
        @input="inputHandler"
      />

      <label class="checkbox">
        <input type="checkbox" v-model="disabled" />
        Disabled
      </label>

      <label class="checkbox">
        <input type="checkbox" v-model="hasError" />
        With error
      </label>
    </div>
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
.ui-item {
  display: block;
  margin-bottom: 20px;
}
.text-input {
  max-width: 240px;
}
.checkbox {
  font-family: sans-serif;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 10px 0;
  max-width: 100px;
}
</style>
