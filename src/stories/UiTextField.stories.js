/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import UiTextField from '@/components/UiTextField.vue';

const parentStyles = {
  backgroundColor: '#424C66',
  width: '100%',
  padding: '40px 70% 40px 40px',
  boxSizing: 'border-box',
};

storiesOf('UiTextField', module)
  .add('default', () => ({
    components: { UiTextField },
    data() {
      return {
        value: '',
        parentStyles,
      };
    },
    template: `
      <div :style="parentStyles">
        <UiTextField v-model="value" label="Label" @input="action" />
      </div>
    `,
    methods: { action(value) { this.value = value; } },
  }))
  .add('disabled', () => ({
    components: { UiTextField },
    data() {
      return {
        parentStyles,
      };
    },
    template: `
      <div :style="parentStyles">
        <UiTextField label="Label" :disabled="true" />
      </div>
    `,
  }))
  .add('with error', () => ({
    components: { UiTextField },
    data() {
      return {
        value: '',
        parentStyles,
      };
    },
    template: `
      <div :style="parentStyles">
        <UiTextField v-model="value" label="Label" :hasError="true" errorText="Some error text" @input="action" />
      </div>
    `,
    methods: { action(value) { this.value = value; } },
  }));
