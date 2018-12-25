/**
 * App entry point
 */

import Vue from 'vue';
import assert from 'assert';
import './plugins/vuelidate';
import App from './App.vue';
import store from './store/RootStore';
import i18n from './i18n';
import postMessage from './postMessage';
import './baseComponents';
import './vueExtentions';

Vue.config.productionTip = false;

function getLanguage() {
  if (navigator && navigator.language) {
    return navigator.language.slice(0, 2);
  }
  return 'en';
}

async function mountApp(formData, options = {}) {
  await store.dispatch('PaymentForm/initState', { formData, options });

  const language = getLanguage();
  const VueApp = Vue.extend(App);
  new VueApp({
    store,
    i18n: i18n(options.language || language),
  }).$mount('#payone-form');
}

function init() {
  let initialFormData = window.PAYMENT_FORM_DATA;
  postMessage('INIT');

  const isPageInsideIframe = window.location !== window.parent.location;

  if (isPageInsideIframe) {
    window.addEventListener('message', (event) => {
      if (event.data && event.data.source === 'PAYONE_JS_SDK') {
        /** Outside formData inserting is restricted in production mode */
        if (process.env.NODE_ENV === 'development') {
          initialFormData = event.data.data.formData;
        }
        mountApp(initialFormData, event.data.data.options);
      }
    });
  } else {
    assert(document.querySelector('#payone-form'), 'Define "#payone-form" element in the document');
    assert(initialFormData, 'Define "window.PAYMENT_FORM_DATA" property to set initial data');
    mountApp(initialFormData);
  }
}

init();
