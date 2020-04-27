export function stringToBase64(string: string): string {
  return btoa(string).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function objectToBase64(object: object): string {
  return stringToBase64(JSON.stringify(object));
}

// https://github.com/microsoft/TypeScript/issues/13923#issuecomment-594366011
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const abc = stringToBase64(
    String.fromCharCode(
      ...(Array.from(new Uint8Array(buffer)) as readonly number[])
    )
  );
  return abc;
}

type ParsedObject = { readonly [key: string]: any };
export function base64ToObject(base64: string): ParsedObject {
  return JSON.parse(atob(base64)) as ParsedObject;
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  return new Uint8Array(
    base64.split('').map((character) => character.charCodeAt(0))
  ).buffer;
}

export function stringToArrayBuffer(string: string): ArrayBuffer {
  return base64ToArrayBuffer(atob(string));
}

export function pemToArrayBuffer(pem: string): ArrayBuffer {
  return stringToArrayBuffer(
    pem
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\n/g, '')
  );
}
