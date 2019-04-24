/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import BaseButton from '../components/BaseButton.vue';

storiesOf('Button', module)
  .add('with text', () => ({
    components: { BaseButton },
    template: '<BaseButton @click="action">Hello Button</BaseButton>',
    methods: { action: action('clicked') },
  }))
  .add('with JSX', () => ({
    components: { BaseButton },
    render() {
      return <BaseButton onClick={this.action}>With JSX</BaseButton>;
    },
    methods: { action: linkTo('Button', 'with some emoji') },
  }))
  .add('with some emoji', () => ({
    components: { BaseButton },
    template: '<BaseButton @click="action">😀 😎 👍 💯</BaseButton>',
    methods: { action: action('clicked') },
  }));
