import assert from 'assert';
import { invert, includes, get } from 'lodash-es';

export const payoneSdkSourceName = 'PAYSUPER_JS_SDK';
export const payoneFormSourceName = 'PAYSUPER_PAYMENT_FORM';

export const sendingMessagesNames = {
  INITED: 'inited',
  LOADED: 'loaded',
  FORM_RESIZE: 'formResize',
  PAYMENT_FAILED_TO_BEGIN: 'paymentFailedToBegin',
  PAYMENT_NEW: 'paymentNew',
  PAYMENT_BEFORE_CREATED: 'paymentBeforeCreated',
  PAYMENT_CREATED: 'paymentCreated',
  PAYMENT_FAILED_TO_CREATE: 'paymentFailedToCreate',
  PAYMENT_COMPLETED: 'paymentCompleted',
  PAYMENT_CANCELLED: 'paymentCancelled',
  PAYMENT_DECLINED: 'paymentDeclined',
  PAYMENT_INTERRUPTED: 'paymentInterrupted',
  ORDER_RECREATE_STARTED: 'orderRecreateStarted',
  MODAL_CLOSED: 'modalClosed',
};

export const receivingMessagesNames = invert({
  REQUEST_INIT_FORM: 'requestInitForm',
  INITED: 'inited',
});

export function postMessage(nameID, data = {}) {
  const name = sendingMessagesNames[nameID];
  assert(name, `Undefiend postMessage nameID: ${nameID}`);
  const target = window.opener ? window.opener : window.parent;
  target.postMessage({
    source: payoneFormSourceName,
    name,
    data,
  }, '*');
}

export function receiveMessages(from, objectWithCallbacks) {
  from.addEventListener('message', (event) => {
    const source = get(event, 'data.source');
    if (
      !includes([payoneSdkSourceName, payoneFormSourceName], source)
    ) {
      return;
    }
    const { name } = event.data;
    const callback = objectWithCallbacks[receivingMessagesNames[name]];
    if (!callback) {
      return;
    }
    callback(event.data.data);
  });
}
