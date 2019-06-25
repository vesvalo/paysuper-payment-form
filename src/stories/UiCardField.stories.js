/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import UiCardField from '@/components/UiCardField.vue';

storiesOf('UiCardField', module)
  .add('default', () => ({
    components: { UiCardField },
    template: `
      <div>
        <UiCardField/>
        <UiCardField :disabled="true" />
        <UiCardField value="1231231" :disabled="true" />
        <UiCardField value="1231231" />
        <UiCardField :hasError="true" errorText="test" />
      </div>
    `,
  }));
