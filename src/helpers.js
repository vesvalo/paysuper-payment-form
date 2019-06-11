import { trim } from 'lodash-es';

export function getCardSystemType(cardNumber) {
  switch (cardNumber[0]) {
    // Need to add other types and corresponding icons
    case '4': return 'mastercard';
    default: return 'mastercard';
  }
}

export function prepareCardNumber(cardNumber) {
  return trim(cardNumber.replace(/(.{4})/g, '$1 '));
}

export function prepareCardExpiry(expiry) {
  return trim(expiry.replace(/(.{2})/g, '$1/'), '/');
}
