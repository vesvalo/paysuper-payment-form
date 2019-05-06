import { shallowMount } from '@vue/test-utils';
import UiButton from '@/components/UiButton.vue';

describe('UiButton.vue', () => {
  it('should render content', async () => {
    const wrapper = shallowMount(UiButton, {
      slots: {
        default: 'UiButton',
      },
    });
    expect(wrapper.text()).toEqual('UiButton');
  });
});
