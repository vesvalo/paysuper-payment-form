import getFunctionalUrls from '@/getFunctionalUrls';

describe('getFunctionalUrls', () => {
  it('should return value', () => {
    const apiUrl = 'https://localhost';
    const value = getFunctionalUrls(apiUrl);
    expect(value.apiUrl).toEqual(apiUrl);
  });
});
