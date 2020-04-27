import decode from './decode';
import isExpired from './is-expired';
import sign from './sign';

type JWebT = {
  readonly decode: typeof decode;
  readonly isExpired: typeof isExpired;
  readonly sign: typeof sign;
};

const jWebT: JWebT = {
  decode,
  isExpired,
  sign,
};

export default jWebT;
