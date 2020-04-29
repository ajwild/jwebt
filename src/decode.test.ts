import { mocked } from 'ts-jest/utils';

import { decode } from './decode';
import { base64ToObject } from './utils';

jest.mock('./utils');
const mockedBase64ToObject = mocked(base64ToObject);

const fakeJWT = 'abc.def.ghi';

describe('decode', () => {
  test('calls internal functions with correct defaults', () => {
    mockedBase64ToObject.mockReturnValueOnce({ exp: 0 });

    expect(decode(fakeJWT)).toEqual({ exp: 0 });
    expect(mockedBase64ToObject).toBeCalledWith('def');
  });

  describe('options.complete', () => {
    test('complete = true should return object containing header, payload and signature properties', () => {
      mockedBase64ToObject
        .mockReturnValueOnce({ exp: 0 })
        .mockReturnValueOnce({ typ: 'JWT' });
      expect(decode(fakeJWT, { complete: true })).toEqual({
        header: { typ: 'JWT' },
        payload: { exp: 0 },
        signature: 'ghi',
      });
    });
    test('complete = false should return payload only', () => {
      mockedBase64ToObject.mockReturnValueOnce({ exp: 0 });
      expect(decode(fakeJWT, { complete: false })).toEqual({ exp: 0 });
    });
  });
});
