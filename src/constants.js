const buildPurpose = process.env.VUE_APP_BUILD_PURPOSE;

export const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en-US';

const apiUrlMap = {
  dev: 'https://p1payapi.tst.protocol.one',
  test: 'https://p1payapi.tst.protocol.one',
  release: 'https://api.pay.super.com',
};
export const apiUrl = apiUrlMap[buildPurpose] || apiUrlMap.dev;

const formLoadingPageUrlMap = {
  dev: 'http://localhost:4040/loading',
  test: 'https://paysupermgmt.tst.protocol.one/order?loading=true',
  release: 'https://dashboard.pay.super.com/order?loading=true',
};
export const formLoadingPageUrl = formLoadingPageUrlMap[buildPurpose] || formLoadingPageUrlMap.dev;

const websocketServerUrlMap = {
  dev: 'wss://cf.tst.protocol.one/connection/websocket',
  test: 'wss://cf.tst.protocol.one/connection/websocket',
  release: 'wss://ws.pay.super.com/connection/websocket',
};
export const websocketServerUrl = websocketServerUrlMap[buildPurpose] || websocketServerUrlMap.dev;
export const sentryDsn = 'https://3e4a24900f064243a9de45162660a66d@sentry.tst.protocol.one/3';
