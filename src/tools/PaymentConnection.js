import Centrifuge from 'centrifuge';
import Events from 'events';
import { receiveMessages } from '@/postMessage';
import { formLoadingPageUrl, websocketServerUrl } from '@/constants';

export default class PaymentConnection extends Events.EventEmitter {
  constructor({
    window, orderId, token, options,
  }) {
    super();
    this.window = window;
    this.orderId = orderId;
    this.token = token;
    this.options = options;

    this.centrifuge = null;

    this.redirectWindow = null;
    this.redirectWindowClosedInterval = null;
  }

  init() {
    this.centrifuge = new Centrifuge(websocketServerUrl);
    this.centrifuge.setToken(this.token);
    this.centrifuge.subscribe(`paysuper:order#${this.orderId}`, ({ data }) => {
      this.emit('newPaymentStatus', data);
    });
    this.centrifuge.connect();

    this.redirectWindow = this.window.open(formLoadingPageUrl, '_blank');
    this.redirectWindowClosedInterval = setInterval(() => {
      if (this.redirectWindow.closed) {
        this.emit('redirectWindowClosedByUser');
        this.closeRedirectWindow();
      }
    }, 200);

    receiveMessages(this.window, {
      PAYMENT_RESULT_PAGE_REPORT: ({ result }) => {
        if (result === 'success') {
          this.emit('reportSuccess');
        } else {
          this.emit('reportFail');
        }
        this.closeRedirectWindow();
      },
    });
    return this;
  }

  closeRedirectWindow() {
    clearInterval(this.redirectWindowClosedInterval);
    this.redirectWindow.close();
    this.centrifuge.disconnect();
    this.emit('redirectWindowClosed');
    return this;
  }

  setRedirectWindowLocation(location) {
    this.redirectWindow.location = location;
    return this;
  }
}
