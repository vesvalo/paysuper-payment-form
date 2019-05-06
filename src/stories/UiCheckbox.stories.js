/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import UiCheckbox from '../components/UiCheckbox.vue';

const parentStyles = {
  backgroundColor: '#424C66',
  width: '100%',
  padding: '40px',
  boxSizing: 'border-box',
};

storiesOf('UiCheckbox', module)
  .add('simple', () => ({
    components: { UiCheckbox },
    data() {
      return { checked: false };
    },
    render() {
      return (
        <div style={parentStyles}>
          <UiCheckbox checked={this.checked} input={this.action}>Some Label</UiCheckbox>
        </div>
      );
    },
    methods: {
      action() {
        this.checked = !this.checked;
        action('clicked');
      },
    },
  }))
  .add('disabled', () => ({
    components: { UiCheckbox },
    render() {
      return (
        <div style={parentStyles}>
          <UiCheckbox disabled={true}>Some Label</UiCheckbox>
        </div>
      );
    },
  }));
