/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import ActionProcessing from '@/components/ActionProcessing.vue';

storiesOf('ActionProcessing', module)
  .add('simpleLoading', () => ({
    components: { ActionProcessing },
    template: `
      <div style="width: 500px">
        <ActionProcessing />
      </div>
    `,
  }))
  .add('systemSuccess', () => ({
    components: { ActionProcessing },
    template: `
      <div style="width: 500px">
        <ActionProcessing type="systemSuccess" />
      </div>
    `,
  }))
  .add('3ds', () => ({
    components: { ActionProcessing },
    template: `
      <div style="width: 500px">
        <ActionProcessing type="3ds" />
      </div>
    `,
  }));
