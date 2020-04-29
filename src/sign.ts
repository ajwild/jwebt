import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  objectToBase64,
  pemToArrayBuffer,
  stringToArrayBuffer,
} from './utils';
import { DecodedJWTHeader, DecodedJWTPayload, Immutable } from './types';

export type SignOptions = {
  readonly payload: DecodedJWTPayload;
  readonly privateKey?: string;
  readonly secret?: string;
  readonly keyId?: string;
  readonly format?: 'pkcs8';
  readonly algorithm?: 'RS256';
  readonly extractable?: boolean;
  readonly keyUsages?: readonly string[];
};

export async function sign({
  payload,
  privateKey,
  secret,
  keyId,
  format = 'pkcs8',
  algorithm = 'RS256',
  extractable = false,
  keyUsages = ['sign'],
}: Immutable<SignOptions>): Promise<string> {
  const keyData = privateKey
    ? pemToArrayBuffer(privateKey)
    : stringToArrayBuffer(secret ?? '');
  const algorithms = {
    RS256: {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
  };

  const key = await window.crypto.subtle.importKey(
    format,
    keyData,
    algorithms[algorithm],
    extractable,
    // Needed for importKey compatibility
    // eslint-disable-next-line functional/prefer-readonly-type
    keyUsages as string[]
  );

  const header: DecodedJWTHeader = {
    typ: 'JWT',
    alg: algorithm,
  };
  const encodedHeader = objectToBase64(
    keyId ? { ...header, kid: keyId } : header
  );
  const encodedPayload = objectToBase64(payload);
  const data = base64ToArrayBuffer(`${encodedHeader}.${encodedPayload}`);

  const signature = await window.crypto.subtle.sign(
    algorithms[algorithm],
    key,
    data
  );
  const encodedSignature = arrayBufferToBase64(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}
