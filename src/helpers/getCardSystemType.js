import creditCardType from 'credit-card-type';

export default function getCardSystemType(cardNumber) {
  if (!cardNumber) {
    return '';
  }
  const [firstGuess] = creditCardType(String(cardNumber));
  if (!firstGuess) {
    return '';
  }
  return firstGuess.type;
}
