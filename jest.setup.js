/* eslint-disable */
const puppeteer = require('puppeteer');
const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  // failureThreshold: '0.001',
  // failureThresholdType: 'percent'
});
expect.extend({ toMatchImageSnapshot });

beforeAll(async () => {
  global.browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=medium']
  });
  global.page = await global.browser.newPage();
});
afterAll(() => {
  global.browser.close();
});
