# jwebt

> Web Crypto API wrapper for working with JSON Web Tokens (JWT) in browsers and workers.

## Usage

### Install

```sh
npm install jwebt
```

Or

```sh
yarn add jwebt
```

### Sign

Create a JSON Web Token.

#### Options (required)

Options should be passed as an object with the following properties:

##### `payload`: Object (required)
All values within the payload are optional. For more information on properties to use see the latest [JSON Web Token (JWT) Proposed Standard](https://www.rfc-editor.org/rfc/rfc7519.html#section-4).
##### `privateKey`: String (privateKey or secret required)
Typically the contents of a .pem file. The header, footer and line breaks will be handled by the library. If privateKey and secret are provided, privateKey will be used.
##### `secret`: String (privateKey or secret required)
A secret key. If privateKey and secret are provided, privateKey will be used.
##### `keyId`: String (optional)
An optional string used as a hint to indicate which key was used to secure the token.
##### `format`: String (default = `'pkcs8'`)
A string describing the data format of the key to import. Only `'pkcs8'` is supported at the moment.
##### `algorithm`: String (default = `'RS256'`)
Only `'RS256'` is supported at the moment.
##### `extractable`: Boolean (default = `false`)
A boolean indicating whether it will be possible to export the key. In general this is not required for JWT signing and verifying.
##### `keyUsages`: String[] (default = `['sign']`)
An array indicating what can be done with the key. The string `'sign'` is required within the array.
##### `subtleCrypto`: [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) (default = `window?.crypto?.subtle`)
Allows the `SubtleCrypto` interface to be passed through in case `window` is not available. Useful when working with platforms such as [Cloudflare Workers](https://developers.cloudflare.com/workers/reference/apis/web-crypto/), where `crypto.subtle` can be used.

#### Return Value

Returns a Promise which resolves to a JSON Web Token string:

```js
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjk0NjY4ODQwMH0.c2VjcmV0
```

#### Example

```js
import { sign } from 'jwebt';

const currentTimeInSeconds = Math.floor(Date.now() / 1000);
// All values in payload are optional
// The token verifier should specify requirements
const payload = {
  // Common properties
  iss: 'me@example.com',
  sub: 'me@example.com',
  aud: 'https://api.example.com/', // ['orArrayOfStrings'],
  exp: currentTimeInSeconds + (60 * 60), // now + 1 hour
  nbf: currentTimeInSeconds,
  iat: currentTimeInSeconds,
  jti: 'uniqueTokenId',
  // Anything else
  anotherValue: 'anythingGoes',
};
// Use privateKey or secret
const privateKey = '-----BEGIN PRIVATE KEY-----\nexample\n-----END PRIVATE KEY-----\n';
const secret = 'secretKey';
const keyId = 'optionalUniqueKeyIdentifier';

const jwt = await sign({
  payload,
  privateKey,
  secret,
  keyId,
  // default values below
  format: 'pkcs8',
  algorithm: 'RS256',
  extractable: false,
  keyUsages: ['sign'],
  subtleCrypto: window.crypto.subtle,
});

console.log(jwt); // 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjk0NjY4ODQwMH0.c2VjcmV0'
```

### Verify

Not yet implemented.

### Decode

Decode a JSON Web Token.

#### Options (optional)

Options should be passed as an object with the following property:

##### `complete`: Boolean (default = `false`)
The default behaviour is to return the decoded payload object. When complete is `true` it will return an object containing `header`, `payload` and `signature` properties.

#### Example

```js
import { decode } from 'jwebt';

const jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjk0NjY4ODQwMH0.c2VjcmV0';

const decodedJwt = decode(jwt, { complete: false });
console.log(decodedJwt); // { 'exp': 946688400 }

const completeJwt = decode(jwt, { complete: true });
console.log(completeJwt);
/*
{
  header: {
    typ: 'JWT',
    alg: 'RS256',
  },
  payload: {
    exp: 946688400,
  },
  signature: 'c2VjcmV0'
}
*/
```

### Is Expired

#### Options (optional)

Options should be passed as an object with the following property:

##### `expiredWithinSeconds`: Number (default = `0`)
Allows adjustments to the expiry time check to help identify tokens which are about to expire.

#### Example

```js
import { isExpired } from 'jwebt';

const jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjk0NjY4ODQwMH0.c2VjcmV0';

const jwtExpired = isExpired(jwt, { expiredWithinSeconds: 5 });
console.log(jwtExpired); // true
```

## Tests

```sh
npm test
```

## License

This project is [MIT](https://github.com/ajwild/jwebt/blob/master/LICENSE) licensed.
