/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import LocaleChanger from '@/components/LocaleChanger.vue';

storiesOf('LocaleChanger', module)
  .add('default', () => ({
    components: { LocaleChanger },
    template: `
      <div>
        <LocaleChanger />
      </div>
    `,
  }));
