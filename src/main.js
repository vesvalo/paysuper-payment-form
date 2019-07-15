/**
 * App entry point
 */

import * as Sentry from '@sentry/browser';
import Vue from 'vue';
import assert from 'assert';
import Sandbox from '@/Sandbox.vue';
import Page from '@/Page.vue';
import Modal from '@/Modal.vue';
import Loading from '@/Loading.vue';
import '@/plugins/vuelidate';
import store from '@/store/RootStore';
import i18n from '@/i18n';
import { postMessage, receiveMessages } from '@/postMessage';
import localesScheme from '@/locales/scheme';
import getLanguage from '@/helpers/getLanguage';
import viewSchemes from '@/viewSchemes';
import '@/globalComponents';
import '@/vueExtentions';
import { config, set } from '@/analytics';

const isProd = process.env.NODE_ENV === 'production';

Vue.config.productionTip = false;

if (isProd) {
  Sentry.init({
    dsn: 'https://3e4a24900f064243a9de45162660a66d@sentry.tst.protocol.one/3',
    integrations: [new Sentry.Integrations.Vue({ Vue })],
  });
}

const isPageInsideIframe = window.location !== window.parent.location;

/**
 * Mounts the app into element
 *
 * @param {Object} orderParams
 * @param {Object} optionsCustom
 */
async function mountApp(orderParams, optionsCustom = {}) {
  assert(
    document.querySelector('#p1payone-form'),
    'Define "#p1payone-form" element in the document to mount the app',
  );

  if (!window.opener) {
    if (isPageInsideIframe) {
      assert(orderParams, 'The order params are not recieved');
    } else {
      assert(orderParams, '"window.PAYSUPER_ORDER_PARAMS" in not defined or empty');
    }
  }

  const language = getLanguage(localesScheme, navigator);
  const options = {
    apiUrl: window.PAYSUPER_API_URL || 'https://p1payapi.tst.protocol.one',
    email: '',
    viewScheme: 'dark',
    viewSchemeConfig: null,
    layout: 'page',
    isPageInsideIframe,
    language,
    ...optionsCustom,
  };

  if (options.layout !== 'loading') {
    store.dispatch('initState', {
      orderParams,
      options,
    });
  }

  let appComponent = Modal;
  if (options.layout === 'page') {
    appComponent = Page;
  } else if (options.layout === 'loading') {
    appComponent = Loading;
  } else if (process.env.NODE_ENV === 'development' && options.layout === 'sandbox') {
    appComponent = Sandbox;
  }
  const VueApp = Vue.extend(appComponent);

  Vue.prototype.$gui = options.viewSchemeConfig || viewSchemes[options.viewScheme];

  new VueApp({
    store,
    i18n,
    created() {
      this.$changeLocale(options.language);

      set({
        currency: orderParams.currency,
        viewType: options.layout,
        viewScheme: options.viewScheme,
      });

      config('UA-142750977-1', { page_path: `/${options.layout}` });
    },
  }).$mount('#p1payone-form');
}

if (window.opener || isPageInsideIframe) {
  receiveMessages(window, {
    REQUEST_INIT_FORM(data = {}) {
      const { orderParams, options } = data;
      mountApp(orderParams, options);
    },
  });
} else {
  // Case where the form is opened by as actual page inside browser, not inside iframe
  mountApp(window.PAYSUPER_ORDER_PARAMS, window.PAYSUPER_FORM_OPTIONS);
}

postMessage('INITED');
