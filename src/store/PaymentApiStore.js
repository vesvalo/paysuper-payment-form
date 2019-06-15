export default {
  namespaced: true,

  actions: {
    usePaymentApi({ dispatch }) {
      // Supported payment methods
      const supportedInstruments = [{
        supportedMethods: ['basic-card'],
        data: {
          supportedNetworks: [
            'visa', 'mastercard', 'amex', 'discover',
            'diners', 'jcb', 'unionpay',
          ],
        },
      }];

      // Checkout details
      const details = {
        displayItems: [
          {
            label: 'Original donation amount',
            amount: { currency: 'USD', value: '65.00' },
          }, {
            label: 'Friends and family discount',
            amount: { currency: 'USD', value: '-10.00' },
          },
        ],
        total: {
          label: 'Total due',
          amount: { currency: 'USD', value: '55.00' },
        },
      };

      const options = {
        requestPayerEmail: true,
      };

      // 1. Create a `PaymentRequest` instance
      const request = new PaymentRequest(supportedInstruments, details, options);

      // 2. Show the native UI with `.show()`
      request.show()
        .then(async (result) => {
          const data = {
            cardNumber: result.details.cardNumber,
            cardHolder: result.details.cardholderName,
            month: result.details.expiryMonth,
            year: result.details.expiryYear,
            cvv: result.details.cardSecurityCode,
            email: result.payerEmail,
          };
          result.complete('success');
          dispatch('createPayment', data);
        })
        .catch(() => {
          // user just closed the window
        });
    },
  },
};
