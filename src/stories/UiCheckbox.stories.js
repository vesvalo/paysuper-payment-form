/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import UiCheckbox from '@/components/UiCheckbox.vue';

const parentStyles = {
  backgroundColor: '#424C66',
  width: '100%',
  padding: '40px',
  boxSizing: 'border-box',
};

storiesOf('UiCheckbox', module)
  .add('default', () => ({
    components: { UiCheckbox },
    data() {
      return {
        checked: false,
        parentStyles,
      };
    },
    template: `
      <div :style="parentStyles">
        <UiCheckbox :checked="checked" @input="action">Some Label</UiCheckbox>
      </div>
    `,
    methods: {
      action(value) {
        this.checked = value;
      },
    },
  }))
  .add('disabled', () => ({
    components: { UiCheckbox },
    data() {
      return { parentStyles };
    },
    template: `
      <div :style="parentStyles">
        <UiCheckbox :disabled="true" @input="action">Some Label</UiCheckbox>
      </div>
    `,
  }));
