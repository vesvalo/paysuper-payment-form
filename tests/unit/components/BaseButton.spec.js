import { shallowMount } from '@vue/test-utils';
import BaseButton from '@/components/BaseButton.vue';

describe('BaseButton.vue', () => {
  it('should render content', async () => {
    const wrapper = shallowMount(BaseButton, {
      slots: {
        default: 'check',
      },
    });
    expect(wrapper.text()).toEqual('check');

    // await page.goto('http://localhost:6006/iframe.html?selectedKind=Button&selectedStory=with+text');
    // const image = await page.screenshot();

    // expect(image).toMatchImageSnapshot();
  });
});
