import { base64ToObject } from './utils';
import { DecodedJWTHeader, DecodedJWTPayload } from './types';

export type DecodeOptions = {
  readonly complete?: boolean;
};

// Allow mutations of data returned by library
/* eslint-disable functional/prefer-readonly-type */
export type DecodedJWT = {
  header: DecodedJWTHeader;
  payload: DecodedJWTPayload;
  signature: string;
};
/* eslint-enable functional/prefer-readonly-type */

export function decode(
  jwt: string,
  { complete = false }: DecodeOptions = {}
): DecodedJWT | DecodedJWTPayload {
  const [encodedHeader, encodedPayload, signature] = jwt.split('.');

  const payload = base64ToObject(encodedPayload) as DecodedJWTPayload;

  return complete
    ? {
        header: base64ToObject(encodedHeader) as DecodedJWTHeader,
        payload,
        signature,
      }
    : payload;
}
