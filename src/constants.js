export const buildPurpose = process.env.VUE_APP_BUILD_PURPOSE;

export const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en-US';

const apiUrlMap = {
  dev: 'https://checkout.tst.pay.super.com',
  test: 'https://checkout.tst.pay.super.com',
  stage: 'https://checkout.stg.pay.super.com',
  release: 'https://checkout.pay.super.com',
};
export const apiUrl = apiUrlMap[buildPurpose] || apiUrlMap.dev;

const formLoadingPageUrlMap = {
  dev: 'http://localhost:4040/?loading=true',
  test: 'https://checkout.tst.pay.super.com/pay/order/?loading=true',
  stage: 'https://checkout.stg.pay.super.com/pay/order/?loading=true',
  release: 'https://checkout.pay.super.com/pay/order/?loading=true',
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
