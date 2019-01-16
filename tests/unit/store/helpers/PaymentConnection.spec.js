import PaymentConnection from '@/store/helpers/PaymentConnection';

class WindowMock {
  constructor() {
    this.listeners = {
      message() { },
    };
    this.closed = false;
    this.location = undefined;
  }

  addEventListener(name, handler) {
    this.listeners[name] = handler;
    return this;
  }

  postMessage(data) {
    this.listeners.message({
      data,
    });
  }

  // eslint-disable-next-line
  open(location) {
    this.location = location;
    return new WindowMock();
  }

  close() {
    this.closed = true;
    return this;
  }
}

describe('PaymentConnection', () => {
  const window = new WindowMock();
  const orderID = '123';
  const token = 'imFake';

  it('should contain orderID & token', () => {
    const paymentConnection = new PaymentConnection(window, orderID, token);
    expect(paymentConnection.orderID).toEqual(orderID);
    expect(paymentConnection.token).toEqual(token);
  });

  it('should close redirectWindow on final success', () => {
    let result = false;
    const paymentConnection = new PaymentConnection(window, orderID, token);
    paymentConnection
      .init()
      .on('redirectWindowClosed', () => {
        result = true;
      });

    paymentConnection.window.postMessage({
      name: 'FINAL_SUCCESS',
    });

    expect(result).toEqual(true);
  });

  it('should emit special event if redirectWindow is closed by user', (done) => {
    let result = false;
    const paymentConnection = new PaymentConnection(window, orderID, token);
    paymentConnection
      .init()
      .on('redirectWindowClosedByUser', () => {
        result = true;
      });

    paymentConnection.redirectWindow.close();
    setTimeout(() => {
      expect(result).toEqual(true);
      done();
    }, 300);
  });

  it('should be able to set redirectWindow location', () => {
    const paymentConnection = new PaymentConnection(window, orderID, token);
    const url = 'test';
    paymentConnection
      .init()
      .setRedirectWindowLocation(url);
    expect(paymentConnection.redirectWindow.location).toEqual(url);
  });
});
