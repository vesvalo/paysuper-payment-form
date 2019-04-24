/* eslint-disable */
const puppeteer = require('puppeteer');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

beforeAll(async () => {
  global.browser = await puppeteer.launch();
  global.page = await global.browser.newPage();
});
afterAll(() => {
  global.browser.close();
});
