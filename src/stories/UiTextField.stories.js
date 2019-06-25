/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import UiTextField from '@/components/UiTextField.vue';

storiesOf('UiTextField', module)
  .add('default', () => ({
    components: { UiTextField },
    data() {
      return {
        value: '123',
      };
    },
    template: `
      <div>
        <UiTextField @input="action" />
        <UiTextField label="Label" @input="action" />
        <UiTextField v-model="value" label="Label" @input="action" />
        <UiTextField label="Label" :disabled="true" />
        <UiTextField v-model="value" label="Label" :disabled="true" />
        <UiTextField v-model="value" label="Label" :hasError="true" errorText="Some error text" @input="action" />
      </div>
    `,
    methods: { action(value) { this.value = value; } },
  }));
