import { trim } from 'lodash-es';

export default function prepareCardExpiry(expiry) {
  return trim(expiry.replace(/(.{2})/g, '$1/'), '/');
}
