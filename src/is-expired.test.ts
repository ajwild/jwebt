import { mocked } from 'ts-jest/utils';

import { isExpired } from './is-expired';
import { decode } from './decode';

jest.mock('./decode');
const mockedDecode = mocked(decode);

const fakeJWT = 'abc.def.ghi';

describe('isExpired', () => {
  test('JWT without exp should not expire', () => {
    mockedDecode.mockImplementationOnce(() => ({}));
    expect(isExpired(fakeJWT)).toBe(false);
  });
  test('JWT with future exp date should not be expired', () => {
    const exp = Math.floor(new Date().getTime() / 1000) + 60;
    mockedDecode.mockImplementationOnce(() => ({ exp }));
    expect(isExpired(fakeJWT)).toBe(false);
  });
  test('JWT with past exp date should be expired', () => {
    const exp = Math.floor(new Date().getTime() / 1000) - 60;
    mockedDecode.mockImplementationOnce(() => ({ exp }));
    expect(isExpired(fakeJWT)).toBe(true);
  });

  describe('options.expiredWithinSeconds', () => {
    test('JWT expiring in 61 seconds is not expired when expiredWithinSeconds = 60', () => {
      const exp = Math.floor(new Date().getTime() / 1000) + 61;
      mockedDecode.mockImplementationOnce(() => ({ exp }));
      expect(isExpired(fakeJWT, { expiredWithinSeconds: 60 })).toBe(false);
    });
    test('JWT expiring in 59 seconds is expired when expiredWithinSeconds = 60', () => {
      const exp = Math.floor(new Date().getTime() / 1000) + 59;
      mockedDecode.mockImplementationOnce(() => ({ exp }));
      expect(isExpired(fakeJWT, { expiredWithinSeconds: 60 })).toBe(true);
    });
  });
});
