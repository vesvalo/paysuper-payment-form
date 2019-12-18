export const buildPurpose = process.env.VUE_APP_BUILD_PURPOSE;

export const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en-US';

const apiUrlMap = {
  dev: 'https://checkout.tst.protocol.one',
  test: 'https://checkout.tst.protocol.one',
  stage: 'https://api.stg.pay.super.com',
  release: 'https://api.pay.super.com',
};
export const apiUrl = apiUrlMap[buildPurpose] || apiUrlMap.dev;

const formLoadingPageUrlMap = {
  dev: 'http://localhost:8080/order?loading=true',
  test: 'https://paysupermgmt.tst.protocol.one/order?loading=true',
  stage: 'https://order.stg.pay.super.com?loading=true',
  release: 'https://order.pay.super.com?loading=true',
};
export const formLoadingPageUrl = formLoadingPageUrlMap[buildPurpose] || formLoadingPageUrlMap.dev;

const websocketServerUrlMap = {
  dev: 'wss://cf.tst.protocol.one/connection/websocket',
  test: 'wss://cf.tst.protocol.one/connection/websocket',
  stage: 'wss://ws.stg.pay.super.com/connection/websocket',
  release: 'wss://ws.pay.super.com/connection/websocket',
};
export const websocketServerUrl = websocketServerUrlMap[buildPurpose] || websocketServerUrlMap.dev;
export const sentryDsn = 'https://7a140487808947bf906ba5f2bfe4c4d0@sentry.io/1796339';
