/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import UiButton from '@/components/UiButton.vue';

storiesOf('UiButton', module)
  .add('default', () => ({
    components: { UiButton },
    template: `
      <UiButton @click="action">Some text</UiButton>
    `,
    methods: { action: action('clicked') },
  }))
  .add('with before and after content', () => ({
    components: { UiButton },
    template: `
      <UiButton @click="action">
        <template slot="before">(before content)</template>
        Some text
        <template slot="after">(after content)</template>
      </UiButton>
    `,
    methods: { action: action('clicked') },
  }))
  .add('without border-radius', () => ({
    components: { UiButton },
    template: `
      <UiButton :hasBorderRadius="false">Some text</UiButton>
    `,
  }))
  .add('disabled', () => ({
    components: { UiButton },
    template: `
      <UiButton :disabled="true">Some text</UiButton>
    `,
  }));
