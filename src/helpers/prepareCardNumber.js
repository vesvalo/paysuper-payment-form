import { trim } from 'lodash-es';

export default function prepareCardNumber(cardNumber) {
  return trim(cardNumber.replace(/(.{4})/g, '$1 '));
}
