/* eslint-disable */
const puppeteer = require('puppeteer');
const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

const customConfig = { threshold: 0.05 };
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: customConfig,
  noColors: true,
});
expect.extend({ toMatchImageSnapshot });

beforeAll(async () => {
  global.browser = await puppeteer.launch();
  global.page = await global.browser.newPage();
});
afterAll(() => {
  global.browser.close();
});
