import assert from 'assert';

export const messageNames = {
  INIT: 'init',
  LOAD: 'load',
  FORM_RESIZE: 'formResize',
  STATUS: 'status',
  STATUS_INVOICE: 'statusInvoice',
  STATUS_DELIVERING: 'statusDelivering',
  STATUS_TROUBLED: 'statusTroubled',
  STATUS_DONE: 'statusDone',
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
