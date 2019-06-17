/**
 * App entry point
 */

import * as Sentry from '@sentry/browser';
import Vue from 'vue';
import assert from 'assert';
import locales from '@/locales/scheme';
import Sandbox from './Sandbox.vue';
import Page from './Page.vue';
import Modal from './Modal.vue';
import './plugins/vuelidate';
import store from './store/RootStore';
import i18n from './i18n';
import { postMessage, receiveMessages } from './postMessage';
import viewSchemes from './viewSchemes';
import './globalComponents';
import './vueExtentions';

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://3e4a24900f064243a9de45162660a66d@sentry.tst.protocol.one/3',
    integrations: [new Sentry.Integrations.Vue({ Vue })],
  });
}

const isPageInsideIframe = window.location !== window.parent.location;

/**
 * Cuts out language 2-letters code from navigator.language
 *
 * @return {String}
 */
function getLanguage() {
  if (navigator && navigator.language) {
    return navigator.language.slice(0, 2);
  }
  return 'en';
}

/**
 * Mounts the app into element
 *
 * @param {Object} formData
 * @param {Object} optionsCustom
 */
async function mountApp(formData, optionsCustom = {}) {
  if (isPageInsideIframe && process.env.NODE_ENV === 'development') {
    assert(formData, 'The initial data supposed to be recieved through postMessage is not defined');
  } else {
    assert(formData, 'Define "window.PAYSUPER_FORM_DATA" property to set initial data');
  }
  assert(document.querySelector('#p1payone-form'), 'Define "#p1payone-form" element in the document');

  if (isPageInsideIframe) {
    document.body.classList.add('inside-iframe');
  }

  const language = getLanguage();
  const options = {
    apiUrl: window.PAYSUPER_API_URL || 'https://p1payapi.tst.protocol.one',
    email: '',
    isModal: true,
    viewScheme: 'dark',
    viewSchemeConfig: null,
    layout: 'page',
    isPageInsideIframe,
    language,
    ...optionsCustom,
  };

  await store.dispatch('initState', {
    formData,
    options,
  });

  let appComponent = Modal;
  if (options.layout === 'page') {
    appComponent = Page;
  } else if (process.env.NODE_ENV === 'development' && options.layout === 'sandbox') {
    appComponent = Sandbox;
  }
  const VueApp = Vue.extend(appComponent);

  Vue.prototype.$gui = options.viewSchemeConfig || viewSchemes[options.viewScheme];

  new VueApp({
    store,
    i18n,
    created() {
      const locale = options.language;
      this.$i18n.locale = locale;

      if (locales[locale].rtl) {
        this.$changeDirection('rtl');
      } else {
        this.$changeDirection('ltr');
      }
    },
  }).$mount('#p1payone-form');
}

postMessage('INITED');

if (isPageInsideIframe) {
  receiveMessages(window, {
    REQUEST_INIT_FORM(data = {}) {
      const { formData, options } = data;

      /**
       * Outside formData inserting is restricted in production mode
       */
      if (process.env.NODE_ENV === 'development') {
        mountApp(formData, options);
      } else {
        mountApp(window.PAYSUPER_FORM_DATA, options);
      }
    },
  });
} else {
  // Case where the form is opened by as actual page inside browser, not inside iframe
  mountApp(window.PAYSUPER_FORM_DATA, window.PAYSUPER_FORM_OPTIONS);
}
