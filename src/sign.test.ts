import { mocked } from 'ts-jest/utils';

import { sign } from './sign';
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  objectToBase64,
  pemToArrayBuffer,
} from './utils';

jest.mock('./utils');
const mockedArrayBufferToBase64 = mocked(arrayBufferToBase64);
const mockedBase64ToArrayBuffer = mocked(base64ToArrayBuffer);
const mockedObjectToBase64 = mocked(objectToBase64);
const mockedPemToArrayBuffer = mocked(pemToArrayBuffer);

type GlobalAny = {
  [key: string]: any;
  crypto: {
    subtle: {
      importKey: jest.Mock;
      sign: jest.Mock;
    };
  };
};

const globalOriginal = ({ ...global } as unknown) as GlobalAny;
let globalAny = (global as unknown) as GlobalAny;

describe('sign', () => {
  beforeEach(() => {
    globalAny.crypto = {
      subtle: {
        importKey: jest.fn(),
        sign: jest.fn(),
      },
    };
  });

  afterEach(() => {
    globalAny = globalOriginal;
  });

  test('calls internal functions with correct defaults', async () => {
    const header = {
      typ: 'JWT',
      alg: 'RS256',
    };
    const payload = { hello: 'world' };
    const privateKey = 'abc123';
    const algorithm = {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    };
    const cryptoKey = {
      algorithm: {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      extractable: false,
      type: 'JWT',
      usages: ['sign'],
    };

    mockedPemToArrayBuffer.mockReturnValue(new ArrayBuffer(10));
    globalAny.crypto.subtle.importKey.mockReturnValue(cryptoKey);
    mockedObjectToBase64.mockReturnValueOnce('abc').mockReturnValueOnce('def');
    mockedBase64ToArrayBuffer.mockReturnValue(new ArrayBuffer(20));
    globalAny.crypto.subtle.sign.mockReturnValue(new ArrayBuffer(30));
    mockedArrayBufferToBase64.mockReturnValue('ghi');

    expect(await sign({ payload, privateKey })).toBe('abc.def.ghi');
    expect(mockedPemToArrayBuffer).toBeCalledTimes(1);
    expect(globalAny.crypto.subtle.importKey).toBeCalledWith(
      'pkcs8',
      new ArrayBuffer(10),
      algorithm,
      false,
      ['sign']
    );
    expect(mockedObjectToBase64).toBeCalledWith(header);
    expect(mockedObjectToBase64).toBeCalledWith(payload);
    expect(mockedBase64ToArrayBuffer).toBeCalledWith('abc.def');
    expect(globalAny.crypto.subtle.sign).toBeCalledWith(
      algorithm,
      cryptoKey,
      new ArrayBuffer(20)
    );
    expect(mockedArrayBufferToBase64).toBeCalledWith(new ArrayBuffer(30));
  });
});
