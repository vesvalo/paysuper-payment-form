import { shallowMount } from '@vue/test-utils';
import BaseButton from '@/components/BaseButton.vue';

describe('BaseButton.vue', () => {
  it('should render content', () => {
    const wrapper = shallowMount(BaseButton, {
      slots: {
        default: 'check',
      },
    });
    expect(wrapper.text()).toEqual('check');
    expect(wrapper.element).toMatchSnapshot();
  });
});
