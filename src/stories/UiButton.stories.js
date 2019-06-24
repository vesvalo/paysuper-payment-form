/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import UiButton from '@/components/UiButton.vue';

storiesOf('UiButton', module)
  .add('default', () => ({
    components: { UiButton },
    template: `
      <div>
        <UiButton @click="action">Some text</UiButton>
      </di>
      <UiButton @click="action">
        <template slot="before">(before content)</template>
        Some text
        <template slot="after">(after content)</template>
      </UiButton>
      <UiButton :hasBorderRadius="false">Some text</UiButton>
      <UiButton :disabled="true">Some text</UiButton>
    `,
    methods: { action: action('clicked') },
  }));
