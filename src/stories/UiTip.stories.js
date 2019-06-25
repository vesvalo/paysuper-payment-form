/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import UiTip from '@/components/UiTip.vue';

const parentStyles = {
  position: 'relative',
  marginTop: '100px',
  width: '100px',
  height: '1px',
};

storiesOf('UiTip', module)
  .add('default', () => ({
    components: { UiTip },
    data() {
      return {
        parentStyles,
      };
    },
    template: `
      <div>
        <div :style="parentStyles">
          <UiTip :visible="true">Some text</UiTip>
        </div>
        <div :style="parentStyles">
          <UiTip :visible="true" innerPosition="center">Some text</UiTip>
        </div>
        <div :style="parentStyles">
          <UiTip :visible="true" height="60px" width="200px">Some text</UiTip>
        </div>
        <div :style="parentStyles">
          <UiTip :visible="true" section="form">Some text</UiTip>
        </div>
        <div :style="parentStyles">
          <UiTip :visible="true" maxHeight="60px">
            Some text Some text Some text Some text Some text Some text
          </UiTip>
        </div>
      </div>
    `,
  }));
