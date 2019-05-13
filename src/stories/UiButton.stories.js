/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import UiButton from '../components/UiButton.vue';

storiesOf('UiButton', module)
  .add('default', () => ({
    components: { UiButton },
    render() {
      return <UiButton onClick={this.action}>Some text</UiButton>;
    },
    methods: { action: action('clicked') },
  }))
  .add('with before and after content', () => ({
    components: { UiButton },
    render() {
      return (
        <UiButton onClick={this.action}>
          <template slot="before">(before content)</template>
          Some text
          <template slot="after">(after content)</template>
        </UiButton>
      );
    },
    methods: { action: action('clicked') },
  }))
  .add('disabled', () => ({
    components: { UiButton },
    render() {
      return <UiButton disabled={true}>Some text</UiButton>;
    },
  }));
