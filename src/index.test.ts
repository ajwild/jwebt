import { decode, isExpired, sign } from '.';

describe('jwebt', () => {
  test('exports decode function', () => {
    expect(typeof decode).toBe('function');
  });
  test('exports isExpired function', () => {
    expect(typeof isExpired).toBe('function');
  });
  test('exports sign function', () => {
    expect(typeof sign).toBe('function');
  });
});
