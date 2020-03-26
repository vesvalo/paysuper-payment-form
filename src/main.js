/**
 * App entry point
 */

import * as Sentry from '@sentry/browser';
import Vue from 'vue';
import qs from 'qs';
import assert from 'assert';
import { get, includes } from 'lodash-es';
import webfontloader from 'webfontloader';
import Vue2TouchEvents from 'vue2-touch-events';
import Sandbox from '@/Sandbox.vue';
import App from '@/App.vue';
import Loading from '@/Loading.vue';
import '@/plugins/vuelidate';
import '@/plugins/cssRules';
import '@/plugins/extendAxios';
import store from '@/store/RootStore';
import i18n from '@/i18n';
import { postMessage, receiveMessages } from '@/postMessage';
import viewSchemes from '@/viewSchemes';
import '@/globalComponents';
import '@/vueExtentions';
import { gtagConfig, gtagSet } from '@/analytics';
import { buildPurpose, apiUrl, sentryDsn } from '@/constants';
import 'intl';
import 'intl/locale-data/jsonp/en';
import '@/noScalableViewport';

gtagConfig('UA-142750977-1', { page_path: window.location.pathname });

Vue.use(Vue2TouchEvents);

Vue.config.productionTip = false;
const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [new Sentry.Integrations.Vue({ Vue, attachProps: true })],
    environment: process.env.VUE_APP_BUILD_PURPOSE,
  });
}

const mountPoint = '#paysuper-payment-form';
const isPageInsideIframe = window.location !== window.parent.location;

function getOrderParams({
  project, token, products, amount, type, currency, devPreset,
}) {
  const testData = {
    simple: {
      project: '5db8141ff0c9c60001a859e1',
      amount: 30,
      currency: 'USD',
      type: 'simple',
    },
    product: {
      project: '5db8183cf0c9c60001a88c8c',
      products: ['5e5693a5d23106a429b1909a'],
      type: 'product',
    },
    key: {
      project: '5db8141ff0c9c60001a859e1',
      products: ['5e00bf50f091a2937c71574a'],
      type: 'key',
    },
  };

  return {
    ...(devPreset ? get(testData, devPreset, testData.simple) : {}),
    ...(project ? { project } : {}),
    ...(token ? { token } : {}),
    ...(products ? { products } : {}),
    ...(amount ? { amount: Number(amount), currency } : {}),
    ...(type ? { type } : {}),
  };
}

function getBaseOptions(query) {
  if (query.loading) {
    return { layout: 'loading' };
  }

  if (buildPurpose === 'dev' && query.modal) {
    return { layout: 'modal' };
  }
  return {};
}

/**
 * Mounts the app into element
 *
 * @param {Object} orderParams
 * @param {Object} baseOptions
 * @param {Object} customOptions
 */
async function mountApp({
  orderParams,
  baseOptions,
  customOptions = {},
  query,
}) {
  assert(
    document.querySelector(mountPoint),
    `Define "${mountPoint}" element in the document to mount the app`,
  );

  const options = {
    apiUrl,
    email: '',
    viewScheme: 'dark',
    viewSchemeConfig: null,
    layout: 'page',
    isPageInsideIframe,
    ...baseOptions,
    ...customOptions,
  };

  gtagSet({
    viewType: options.layout,
    viewScheme: options.viewScheme,
  });

  store.dispatch('initState', {
    orderParams,
    options,
    query,
  });

  let appComponent = App;
  if (options.layout === 'page') {
    if (isPageInsideIframe) {
      // Prevents scrollbar dangling before formResize ?
      document.body.style.overflow = 'hidden';
      document.body.parentNode.style.overflow = 'hidden';
    }
  } else if (options.layout === 'loading') {
    appComponent = Loading;
  } else if (process.env.NODE_ENV === 'development' && options.layout === 'sandbox') {
    appComponent = Sandbox;
  }
  const VueApp = Vue.extend(appComponent);

  Vue.prototype.$gui = {
    ...viewSchemes[options.viewScheme],
    ...(options.viewSchemeConfig || {}),
  };

  new VueApp({
    store,
    i18n,
    watch: {
      '$store.state.initialLocale': {
        handler(value) {
          if (value) {
            this.$changeLocale(value);
          }
        },
        immediate: true,
      },
    },
    created() {
      webfontloader.load({
        google: {
          families: ['PT Mono'],
        },
      });
    },
  }).$mount(mountPoint);
}

const [, queryString] = window.location.href.split('?');
const query = qs.parse(queryString);
const orderParams = getOrderParams(query);
const baseOptions = getBaseOptions(query);

if (includes(['success', 'fail'], query.result)) {
  if (window.opener) {
    window.opener.postMessage({
      source: 'PAYSUPER_PAYMENT_PAGE',
      name: 'PAYMENT_RESULT_PAGE_REPORT',
      data: {
        result: query.result,
      },
    }, '*');
  }
} else if (query.sdk) {
  receiveMessages(window, {
    REQUEST_INIT_FORM(data = {}) {
      const { options } = data;
      mountApp({
        orderParams,
        baseOptions,
        customOptions: { ...options, formUsage: 'embed' },
        query,
      });
    },
  });
} else {
  let isFramed = false;
  try {
    isFramed = window !== window.top
      || document !== window.top.document
      || window.self.location !== window.top.location;
  } catch (e) {
    isFramed = true;
  }
  // Case where the form is opened by as actual page inside browser, not inside iframe
  mountApp({
    orderParams,
    baseOptions,
    query,
    customOptions: { formUsage: isFramed ? 'iframe' : 'standalone' },
  });
}

postMessage('INITED');
