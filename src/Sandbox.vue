<script>
import CartSection from '@/components/CartSection.vue';
import cartTestData from './cartTestData';
import ActionProcessing from '@/components/ActionProcessing.vue';

export default {
  components: {
    CartSection,
    ActionProcessing,
  },
  data() {
    return {
      hasClick: false,
      check: false,
      value: '',
      disabled: false,
      hasError: false,
      actionProcessing: {
        icon: 'card',
      },
      cartItems: cartTestData,
      cartItemsCount: 1,
      cartView: 'default',
    };
  },
  watch: {
    cartItemsCount() {
      this.cartView = 'default';
    },
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
  <div class="ui-kit">
    <div class="ui-item">
      <label class="checkbox">
        <input type="checkbox" v-model="disabled" />
        Disabled
      </label>

      <label class="checkbox">
        <input type="checkbox" v-model="hasError" />
        With error
      </label>
    </div>
    <UiButton
      class="ui-item"
      @click="clickHandler"
      :disabled="disabled"
    >
      <template v-if="hasClick" slot="before">Before</template>
      Text for button
      <template v-if="!hasClick" slot="after">After</template>
    </UiButton>
    <div class="ui-item">
      <UiCheckbox
        v-model="check"
        :disabled="disabled"
        @input="checkHandler"
      >
        Label for checkbox
      </UiCheckbox>
    </div>
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
    </div>
    <div class="ui-item">
      <UiSimplePreloader />
    </div>
    <div style="width: 640px; height: 510px; box-shadow: 0 0 5px #000; position: relative">
      <ActionProcessing :icon="actionProcessing.icon" />
        <select v-model="actionProcessing.icon">
        <option value="card">card</option>
        <option value="other">other</option>
      </select>
    </div>
    <br>
    <div>
      <UiScrollbarBox style="width: 320px; height: 440px; background: #333B50;">
        <CartSection
          :items="cartItems.slice(0, cartItemsCount)"
          :view="cartView"
        />
      </UiScrollbarBox>
      <input type="number" min="1" max="7" v-model="cartItemsCount">
      <select v-if="cartItemsCount == 1" v-model="cartView">
        <option value="default">default</option>
        <option value="promo">promo</option>
      </select>
    </div>
  </div>
</div>
</template>

<style lang="scss">
@import '@/assets/styles/reset.scss';
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
  max-width: 210px;
}

.checkbox {
  font-family: sans-serif;
  color: #fff;
  display: inline-flex;
  align-items: center;
  padding: 10px 0;
  max-width: 100px;
  margin-right: 20px;
  cursor: pointer;
}
</style>
