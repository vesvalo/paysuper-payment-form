/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import cartTestData from '@/cartTestData';

import CartSection from '@/components/CartSection.vue';

storiesOf('CartSection', module)
  .add('modal', () => ({
    components: { CartSection },
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
    
      <div style="width: 400px">
        <CartSection :orderData="getOrderItems(0, 1)" />
        <CartSection :orderData="getOrderItems(0, 2)" />
        <CartSection :orderData="getOrderItems(0, 3)" />
        <CartSection :orderData="getOrderItems(0, 4)" />
        <CartSection :orderData="getOrderItems(0, 5)" />
        <CartSection :orderData="getOrderItems(0, 6)" />
        <CartSection :orderData="orderData"  />
      </div>
    `,
  }))
  .add('page', () => ({
    components: { CartSection },
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
        <CartSection layout="page" :orderData="getOrderItems(0, 1)" />
        <CartSection layout="page" :orderData="getOrderItems(7, 8)" />
        <CartSection layout="page" :orderData="getOrderItems(0, 2)" />
        <CartSection layout="page" :orderData="getOrderItems(0, 3)" />
        <CartSection layout="page" :orderData="getOrderItems(0, 4)" />
        <CartSection layout="page" :orderData="getOrderItems(0, 5)" />
        <CartSection layout="page" :orderData="getOrderItems(0, 6)" />
        <CartSection layout="page" :orderData="orderData"  />
        <CartSection layout="page" :orderData="orderData" :isCartOpened="false"  />
      </div>
    `,
  }));
