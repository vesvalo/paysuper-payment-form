import { forEach } from 'lodash-es';

const scheme = {
  UiButton: [
    'default',
    'with-before-and-after-content',
    'disabled',
  ],
  UiCheckbox: [
    'default',
    'disabled',
  ],
  UiTextField: [
    'default',
    'disabled',
    'with-error',
  ],
};

forEach(scheme, (list, key) => {
  describe(`Storybook ${key}`, () => {
    list.forEach((option) => {
      it(`should render ${option}`, async () => {
        await page.goto(
          `http://localhost:6006/iframe.html?selectedKind=${key}&selectedStory=${option}`,
        );
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot();
      });
    });
  });
});
