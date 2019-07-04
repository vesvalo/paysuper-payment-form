/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';

import UiSelect from '@/components/UiSelect.vue';

function data() {
  return {
    options: [
      { label: 'One', value: '11' },
      { label: 'Two Two', value: '22' },
    ],
  };
}

storiesOf('UiSelect', module)
  .add('default', () => ({
    components: { UiSelect },
    template: `
      <div>
        <UiSelect />
        <UiSelect :options="options" value="11" />
        <UiSelect 
          :options="options" 
          value="11"
          appendLabel="111"
          prependLabel="222"
        />
        <UiSelect :options="options" :disabled="true" />
        <UiSelect :options="options" :disabled="true" value="11" />
        <UiSelect :options="options" :hasError="true" errorText="error" />
      </div>
    `,
  }))
  .add('focused', () => ({
    components: { UiSelect },
    data,
    template: `
      <UiSelect :options="options" :isFocused="true" />
    `,
  }));
