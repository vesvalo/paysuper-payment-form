import getCardSystemType from '@/helpers/getCardSystemType';

describe('getCardSystemType', () => {
  it('should return empty type if value is strange', () => {
    const type = getCardSystemType('1231231');
    expect(type).toEqual('');
  });

  it('should handle mastercard', () => {
    const type = getCardSystemType('222');
    expect(type).toEqual('mastercard');
  });

  it('should handle visa', () => {
    const type = getCardSystemType('4444');
    expect(type).toEqual('visa');
  });

  it('should handle numbers', () => {
    const type = getCardSystemType(4444);
    expect(type).toEqual('visa');
  });
});
