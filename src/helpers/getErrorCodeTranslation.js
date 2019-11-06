
import { get } from 'lodash-es';
import i18n from '@/i18n';

function getErrorCodeTranslationByLocale(code, locale) {
  return get(i18n.messages[locale], `errorCodes.${code}`)
    || get(i18n.messages[locale], `errorCodes.${code.slice(0, 2)}*`);
}

export default function getErrorCodeTranslation(code) {
  const noTranslationMessage = 'Unknown error';
  if (!code) {
    return noTranslationMessage;
  }
  return getErrorCodeTranslationByLocale(code, i18n.locale)
    || getErrorCodeTranslationByLocale(code, i18n.fallbackLocale)
    || noTranslationMessage;
}
