import Centrifuge from 'centrifuge';
import Events from 'events';

const websocketServerUrl = window.P1PAYONE_WEBSOCKET_URL
  || 'wss://cf.tst.protocol.one/connection/websocket';


export default class PaymentConnection extends Events.EventEmitter {
  constructor(window, orderID, token) {
    super();
    this.window = window;
    this.orderID = orderID;
    this.token = token;

    this.centrifuge = null;

    this.redirectWindow = null;
    this.redirectWindowClosedInterval = null;
  }

  init() {
    this.centrifuge = new Centrifuge(websocketServerUrl);
    this.centrifuge.setToken(this.token);
    this.centrifuge.subscribe(`payment:notify#${this.orderID}`, ({ data }) => {
      this.emit('newPaymentStatus', data);
    });
    this.centrifuge.connect();

    this.redirectWindow = this.window.open('', '_blank');
    this.redirectWindowClosedInterval = setInterval(() => {
      if (this.redirectWindow.closed) {
        this.emit('redirectWindowClosedByUser');
        this.closeRedirectWindow();
      }
    }, 200);

    this.window.addEventListener('message', (event) => {
      if (event.data.name === 'FINAL_SUCCESS') {
        clearInterval(this.redirectWindowClosedInterval);
        this.closeRedirectWindow();
      }
    });
    return this;
  }

  closeRedirectWindow() {
    this.redirectWindow.close();
    this.centrifuge.disconnect();
    clearInterval(this.redirectWindowClosedInterval);
    this.emit('redirectWindowClosed');
    return this;
  }

  setRedirectWindowLocation(location) {
    this.redirectWindow.location = location;
    return this;
  }
}
