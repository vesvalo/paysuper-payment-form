/**
 * Подключение модуля интернационализации
 */

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import localesScheme from '@/locales/scheme';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const [, locale] = key.split('/');
    messages[locale] = {
      ...(messages[locale] || {}),
      ...locales(key),
    };
  });
  return messages;
}

VueI18n.prototype.getLocaleLabel = function getLocaleLabel() {
  return localesScheme[this.locale].label;
};

export default new VueI18n({
  messages: loadLocaleMessages(),
  silentTranslationWarn: true,
});
