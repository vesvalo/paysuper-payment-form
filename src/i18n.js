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
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

VueI18n.prototype.getLocaleShortLabel = function getLocaleShortLabel() {
  return localesScheme[this.locale].shortLabel;
};

export default new VueI18n({
  messages: loadLocaleMessages(),
  silentTranslationWarn: true,
});
