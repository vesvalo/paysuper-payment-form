import { fallbackLocale } from '@/constants';
import getLanguage from '@/helpers/getLanguage';

describe('getLanguage', () => {
  const localesScheme = {
    'ru-RU': {},
  };

  it('should use exact match if possible', () => {
    const language = getLanguage(localesScheme, 'ru-RU');
    expect(language).toEqual('ru-RU');
  });

  it('should use region if possible', () => {
    const language = getLanguage(localesScheme, 'ru-US');
    expect(language).toEqual('ru-RU');
  });

  it('should use region', () => {
    const language = getLanguage(localesScheme, 'ru');
    expect(language).toEqual('ru-RU');
  });
  it('should user fallback locale on no match', () => {
    const language = getLanguage(localesScheme, 'blablabla');
    expect(language).toEqual(fallbackLocale);
  });
});
