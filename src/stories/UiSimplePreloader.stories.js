/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import UiSimplePreloader from '../components/UiSimplePreloader.vue';

storiesOf('UiSimplePreloader', module)
  .add('default', () => ({
    components: { UiSimplePreloader },
    data() {
      return {
        value: '',
        parentStyles: {
          backgroundColor: '#424C66',
          width: '100%',
          padding: '40px 70% 40px 40px',
          boxSizing: 'border-box',
        },
      };
    },
    template: `
      <div :style="parentStyles">
        <UiSimplePreloader />
      </div>
    `,
  }));
