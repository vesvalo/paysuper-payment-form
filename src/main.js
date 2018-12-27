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

const isPageInsideIframe = window.location !== window.parent.location;

function getLanguage() {
  if (navigator && navigator.language) {
    return navigator.language.slice(0, 2);
  }
  return 'en';
}

async function mountApp(formData, options = {}) {
  if (isPageInsideIframe && process.env.NODE_ENV === 'development') {
    assert(formData, 'The initial data recieved through postMessage is not defined');
  } else {
    assert(formData, 'Define "window.P1PAYONE_FORM_DATA" property to set initial data');
  }
  assert(document.querySelector('#p1payone-form'), 'Define "#p1payone-form" element in the document');

  await store.dispatch('PaymentForm/initState', { formData, options });

  const language = getLanguage();
  const VueApp = Vue.extend(App);
  new VueApp({
    store,
    i18n: i18n(options.language || language),
  }).$mount('#p1payone-form');
}

function init() {
  postMessage('INITED');

  if (isPageInsideIframe) {
    window.addEventListener('message', (event) => {
      if (event.data && event.data.source !== 'PAYONE_JS_SDK') {
        return;
      }
      if (event.data.name === 'requestInitForm') {
        const { formData, options } = event.data.data;
        /** Outside formData inserting is restricted in production mode */
        if (process.env.NODE_ENV === 'development') {
          mountApp(formData, options);
        } else {
          mountApp(window.P1PAYONE_FORM_DATA, options);
        }
      }
    });
  } else {
    /** When the form is opened by direct url in browser */
    mountApp(window.P1PAYONE_FORM_DATA);
  }
}

init();
