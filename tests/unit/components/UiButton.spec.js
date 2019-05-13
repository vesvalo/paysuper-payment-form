import { shallowMount } from '@vue/test-utils';
import UiButton from '@/components/UiButton.vue';

describe('UiButton.vue', () => {
  it('should render content', async () => {
    const wrapper = shallowMount(UiButton, {
      slots: {
        default: 'UiButton',
      },
      mocks: {
        $styles: {
          button: {
            container: {
              backgroundColor: '#5b88de',
            },
            before: {
              color: '#fff',
              marginRight: '12px',
            },
            after: {
              color: '#fff',
              marginLeft: '12px',
            },
          },
        },
      },
    });
    expect(wrapper.text()).toEqual('UiButton');
  });
});
