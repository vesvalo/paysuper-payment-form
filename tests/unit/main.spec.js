describe('main.js', () => {
  it('should say ok', () => {
    expect(1).toEqual(1);
  });
  // describe('getLanguage', () => {
  //   const defaultLanguage = 'en';
  //   it(`should return ${defaultLanguage} if no value and no navigator`, () => {
  //     const value = getLanguage();
  //     expect(value).toEqual(defaultLanguage);
  //   });

  //   it(`should return ${defaultLanguage} if no value and no navigator.language`, () => {
  //     const value = getLanguage(null, {});
  //     expect(value).toEqual(defaultLanguage);
  //   });

  //   it('should return region from navigator.language when no value', () => {
  //     const value = getLanguage(null, {
  //       language: 'ru-RU',
  //     });
  //     expect(value).toEqual('ru');
  //   });
  // });
});
