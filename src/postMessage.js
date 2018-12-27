import assert from 'assert';

export const messageNames = {
  INITED: 'inited',
  LOADED: 'loaded',
  FORM_RESIZE: 'formResize',
  PAYMENT_CREATED: 'paymentCreated',
  PAYMENT_FAILED_TO_CREATE: 'paymentFailedToCreate',
  // PAYMENT_DELIVERING: 'statusDelivering',
  // PAYMENT_TROUBLED: 'statusTroubled',
  PAYMENT_DONE: 'statusDone',
};

export default function postMessage(nameID, data = {}) {
  const name = messageNames[nameID];
  assert(name, `Undefiend postMessage nameID: ${nameID}`);
  window.parent.postMessage({
    source: 'PAYONE_PAYMENT_FORM',
    name,
    data,
  }, '*');
}
