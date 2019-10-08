import { fallbackLocale } from '@/constants';
import getLanguage from '@/helpers/getLanguage';

jest.setTimeout(30000);

describe('getLanguage', () => {
  const localesScheme = {
    'ru-RU': {},
  };

  it('should use exact match if possible', () => {
    const language = getLanguage(localesScheme, {
      language: 'ru-RU',
    });
    expect(language).toEqual('ru-RU');
  });

  it('should use region if possible', () => {
    const language = getLanguage(localesScheme, {
      language: 'ru-US',
    });
    expect(language).toEqual('ru-RU');
  });

  it('should use region', () => {
    const language = getLanguage(localesScheme, {
      language: 'ru',
    });
    expect(language).toEqual('ru-RU');
  });
  it('should user fallback locale on no match', () => {
    const language = getLanguage(localesScheme, {
      language: 'blablabla',
    });
    expect(language).toEqual(fallbackLocale);
  });
});
