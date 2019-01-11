import { shallowMount } from '@vue/test-utils';
import StatusMessages from '@/components/StatusMessages.vue';

const mountOptions = {
  mocks: {
    $t: () => { },
  },
  stubs: ['IconLoadingAnimated', 'IconSuccess', 'IconWarning', 'BaseButton'],
};

const propsDataDefault = {
  isAppFailed: false,

  paymentResultMessage: '',

  activePaymentMethod: {
    vat_amount: 0.5,
    currency: 'USD',
    amount_with_commissions: 2,
  },

  project: {
    name: 'My dear tests',
  },

  orderID: '1234',
};

describe('StatusMessages.vue', () => {
  it('should show no message on NEW status', () => {
    const wrapper = shallowMount(StatusMessages, {
      ...mountOptions,
      propsData: {
        ...propsDataDefault,
        paymentStatus: 'NEW',
      },
    });
    expect(wrapper.findAll('.status-messages-frame').length).toEqual(0);
  });

  it('should show a message if app is failed', () => {
    const wrapper = shallowMount(StatusMessages, {
      ...mountOptions,
      propsData: {
        ...propsDataDefault,
        paymentStatus: 'NEW',
        isAppFailed: true,
      },
    });
    expect(wrapper.findAll('.status-messages-frame').length).toEqual(1);
  });

  const statusesShouldShow = ['PENDING', 'COMPLETED', 'CANCELLED', 'DECLINED'];
  statusesShouldShow.forEach((name) => {
    it(`should show a message on ${name} status`, () => {
      const wrapper = shallowMount(StatusMessages, {
        ...mountOptions,
        propsData: {
          ...propsDataDefault,
          paymentStatus: name,
        },
      });
      expect(wrapper.findAll('.status-messages-frame').length).toEqual(1);
    });
  });
});
