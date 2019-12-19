import Centrifuge from 'centrifuge';
import Events from 'events';
import { receiveMessages } from '@/postMessage';
import { formLoadingPageUrl, websocketServerUrl } from '@/constants';

export default class PaymentConnection extends Events.EventEmitter {
  constructor({
    window, orderId, token, rwcTime = 5000,
  }) {
    super();
    this.window = window;
    this.orderId = orderId;
    this.token = token;
    this.rwcTime = rwcTime;

    this.centrifuge = null;

    this.redirectWindow = null;
    this.redirectWindowClosedInterval = null;
    this.redirectWindowClosedTimeout = null;
    this.isPaymentFinished = false;
    this.isNormallyDisconnected = false;
    this.systemSuccessTimeout = null;
    this.init();
  }

  init() {
    this.centrifuge = new Centrifuge(websocketServerUrl);
    this.centrifuge.setToken(this.token);
    this.centrifuge.subscribe(`paysuper:order#${this.orderId}`, ({ data }) => {
      this.closeRedirectWindow();
      if (data.status === 'PAYMENT_SYSTEM_PROCESSING_SUCCESS') {
        this.reportSystemSuccess();
        return;
      }
      if (data.status === 'COMPLETED') {
        this.emit('paymentCompleted');
      }
      if (data.status === 'DECLINED') {
        this.emit('paymentDeclined', data.decline);
      }
      clearTimeout(this.systemSuccessTimeout);
      this.disconnect();
    });
    this.centrifuge.on('disconnect', (data) => {
      if (this.isNormallyDisconnected) {
        return;
      }
      this.emit('paymentFailed', data);
      this.closeRedirectWindow().disconnect();
    });
    this.centrifuge.connect();

    // Its important to open the window with empty url first. Sup IE11
    this.redirectWindow = this.window.open('', '_blank');
    this.setRedirectWindowLocation(formLoadingPageUrl);

    this.redirectWindowClosedInterval = setInterval(() => {
      if (this.redirectWindow.closed) {
        clearInterval(this.redirectWindowClosedInterval);
        this.redirectWindowClosedTimeout = setTimeout(() => {
          this.emit('redirectWindowClosedByUser');
          this.closeRedirectWindow().disconnect();
        }, this.rwcTime);
      }
    }, 200);

    receiveMessages(this.window, {
      PAYMENT_RESULT_PAGE_REPORT: ({ result }) => {
        if (result === 'success') {
          this.reportSystemSuccess();
        }
        if (result === 'fail') {
          this.reportDecline();
        }
        this.closeRedirectWindow();
      },
    });
    return this;
  }

  disconnect() {
    this.isNormallyDisconnected = true;
    this.centrifuge.disconnect();
    return this;
  }

  closeRedirectWindow() {
    clearInterval(this.redirectWindowClosedInterval);
    clearTimeout(this.redirectWindowClosedTimeout);
    this.redirectWindow.close();
    return this;
  }

  setRedirectWindowLocation(location) {
    this.redirectWindow.location = location;
    return this;
  }

  reportSystemSuccess() {
    if (this.isPaymentFinished) {
      return this;
    }
    this.emit('paymentSystemSuccess');
    this.isPaymentFinished = true;

    this.systemSuccessTimeout = setTimeout(() => {
      this.emit('paymentDeclined', {
        code: 'ps*',
      });
      this.disconnect();
    }, 1000 * 45);

    return this;
  }

  reportDecline() {
    if (this.isPaymentFinished) {
      return this;
    }

    this.emit('paymentDeclined', {
      code: 'ps*',
    });
    this.disconnect();
    this.isPaymentFinished = true;

    return this;
  }
}
