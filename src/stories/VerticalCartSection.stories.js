/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import cartTestData from '@/cartTestData';

import VerticalCartSection from '@/components/VerticalCartSection.vue';

storiesOf('VerticalCartSection', module)
  .add('default', () => ({
    components: { VerticalCartSection },
    data() {
      return {
        orderData: {
          id: '6e09ae25-00e5-4d57-9aa2-47f488a0ea78',
          has_vat: true,
          vat: 226,
          amount: 1129.99,
          total_amount: 1355.99,
          currency: 'RUB',
          project: { name: '1113', url_success: 'https://success', url_fail: 'https://fail' },
          items: cartTestData,
        },
      };
    },
    methods: {
      getOrderItems(from, to) {
        return {
          ...this.orderData,
          items: this.orderData.items.slice(from, to),
        };
      },
    },
    template: `
    
      <div style="width: 500px">
        <VerticalCartSection :orderData="getOrderItems(0, 1)" />
        <VerticalCartSection :orderData="getOrderItems(0, 2)" />
        <VerticalCartSection :orderData="getOrderItems(0, 3)" />
        <VerticalCartSection :orderData="getOrderItems(0, 4)" />
        <VerticalCartSection :orderData="getOrderItems(0, 5)" />
        <VerticalCartSection :orderData="getOrderItems(0, 6)" />
        <VerticalCartSection :orderData="orderData" />
      </div>
    `,
  }));
