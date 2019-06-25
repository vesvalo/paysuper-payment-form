/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import UiCheckbox from '@/components/UiCheckbox.vue';

const parentStyles = {
  width: '100%',
  padding: '15px',
  boxSizing: 'border-box',
};

storiesOf('UiCheckbox', module)
  .add('default', () => ({
    components: { UiCheckbox },
    data() {
      return {
        checked: true,
        parentStyles,
      };
    },
    template: `
      <div>
        <div :style="parentStyles">
          <UiCheckbox @input="action">Some Label</UiCheckbox>
        </div>
        <div :style="parentStyles">
          <UiCheckbox :checked="checked" @input="action">Some Label</UiCheckbox>
        </div>
        <div :style="parentStyles">
          <UiCheckbox :disabled="true" @input="action">Some Label</UiCheckbox>
        </div>
      </div>
    `,
    methods: {
      action(value) {
        this.checked = value;
      },
    },
  }));
