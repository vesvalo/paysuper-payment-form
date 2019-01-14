import { shallowMount } from '@vue/test-utils';
import BaseErrorText from '@/components/BaseErrorText.vue';

describe('BaseButton.vue', () => {
  it('should render content', () => {
    const wrapper = shallowMount(BaseErrorText, {
      slots: {
        default: 'check',
      },
    });
    expect(wrapper.text()).toEqual('check');
  });
});
