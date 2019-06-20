import PaymentConnection from '@/tools/PaymentConnection';

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
  const orderId = '123';
  const token = 'imFake';

  it('should contain orderId & token', () => {
    const paymentConnection = new PaymentConnection(window, orderId, token);
    expect(paymentConnection.orderId).toEqual(orderId);
    expect(paymentConnection.token).toEqual(token);
  });

  it('should close redirectWindow on final success', () => {
    let finalSuccess = false;
    let closed = false;
    const paymentConnection = new PaymentConnection(window, orderId, token);
    paymentConnection
      .init()
      .on('finalSuccess', () => {
        finalSuccess = true;
      })
      .on('redirectWindowClosed', () => {
        closed = true;
      });

    paymentConnection.window.postMessage({
      source: 'PAYSUPER_PAYMENT_FINISHED_PAGE',
      name: 'FINAL_SUCCESS',
    });

    expect(finalSuccess).toEqual(true);
    expect(closed).toEqual(true);
  });

  it('should not close redirectWindow on final success if source is off', () => {
    let finalSuccess = false;
    let closed = false;
    const paymentConnection = new PaymentConnection(window, orderId, token);
    paymentConnection
      .init()
      .on('finalSuccess', () => {
        finalSuccess = true;
      })
      .on('redirectWindowClosed', () => {
        closed = true;
      });

    paymentConnection.window.postMessage({
      name: 'FINAL_SUCCESS',
    });

    expect(finalSuccess).toEqual(false);
    expect(closed).toEqual(false);
  });

  it('should emit special event if redirectWindow is closed by user', (done) => {
    let result = false;
    const paymentConnection = new PaymentConnection(window, orderId, token);
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
    const paymentConnection = new PaymentConnection(window, orderId, token);
    const url = 'test';
    paymentConnection
      .init()
      .setRedirectWindowLocation(url);
    expect(paymentConnection.redirectWindow.location).toEqual(url);
  });
});
