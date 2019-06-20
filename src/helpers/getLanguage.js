import { map, find } from 'lodash-es';
import { fallbackLocale } from '@/constants';

export function getLocalesLayoutScheme(localesScheme) {
  return map(localesScheme, (item, key) => {
    const [lang, region] = key.split('-');
    return {
      key,
      lang,
      region,
    };
  });
}

export default function getLanguage(localesScheme, navigator) {
  if (navigator && navigator.language) {
    if (localesScheme[navigator.language]) {
      return navigator.language;
    }
    const localesLayoutScheme = getLocalesLayoutScheme(localesScheme);
    const [lang] = navigator.language.split('-');
    const localeLayoutSchemeItem = find(localesLayoutScheme, { lang });

    if (localeLayoutSchemeItem) {
      return localeLayoutSchemeItem.key;
    }
  }
  return fallbackLocale;
}
