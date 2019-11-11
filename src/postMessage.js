import assert from 'assert';
import { includes, get } from 'lodash-es';
import { postMessageOrigin } from '@/constants';

export const paysuperSdkSourceName = 'PAYSUPER_JS_SDK';
export const paysuperFormSourceName = 'PAYSUPER_PAYMENT_FORM';
export const paysuperPaymentPageName = 'PAYSUPER_PAYMENT_PAGE';

export const sendingMessagesNames = [
  'INITED',
  'LOADED',
  'FORM_RESIZE',
  'PAYMENT_FAILED_TO_BEGIN',
  'PAYMENT_NEW',
  'PAYMENT_BEFORE_CREATED',
  'PAYMENT_CREATED',
  'PAYMENT_FAILED_TO_CREATE',
  'PAYMENT_COMPLETED',
  'PAYMENT_CANCELLED',
  'PAYMENT_DECLINED',
  'PAYMENT_INTERRUPTED',
  'PAYMENT_SYSTEM_SUCCESS',
  'TRY_TO_BEGIN_AGAIN',
  'MODAL_CLOSED',
];

export const receivingMessagesNames = [
  'REQUEST_INIT_FORM',
  'PAYMENT_RESULT_PAGE_REPORT',
];

export function postMessage(name, data = {}) {
  assert(includes(sendingMessagesNames, name), `Undefiend postMessage name: ${name}`);
  const target = window.opener ? window.opener : window.parent;
  target.postMessage({
    source: paysuperFormSourceName,
    name,
    data,
  }, postMessageOrigin);
}

export function receiveMessages(from, objectWithCallbacks) {
  from.addEventListener('message', (event) => {
    const source = get(event, 'data.source');
    if (
      !includes([paysuperSdkSourceName, paysuperFormSourceName, paysuperPaymentPageName], source)
    ) {
      return;
    }
    const { name } = event.data;
    if (!includes(receivingMessagesNames, name)) {
      return;
    }
    const callback = objectWithCallbacks[name];
    if (!callback) {
      return;
    }
    callback(event.data.data);
  });
}
