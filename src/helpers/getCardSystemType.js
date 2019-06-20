export default function getCardSystemType(cardNumber) {
  switch (cardNumber[0]) {
    // Need to add other types and corresponding icons
    case '4': return 'mastercard';
    default: return 'mastercard';
  }
}
