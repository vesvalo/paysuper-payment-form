/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import VerticalModal from '@/components/VerticalModal.vue';
import VerticalModalCart from '@/components/VerticalModalCart.vue';
import VerticalModalForm from '@/components/VerticalModalForm.vue';
import OrderCreationError from '@/components/OrderCreationError.vue';

const parentStyles = {
  position: 'relative',
  width: '360px',
  height: '540px',
};

storiesOf('VerticalModal', module)
  .add('default', () => ({
    components: { VerticalModal, VerticalModalCart, VerticalModalForm },
    data() {
      return { parentStyles };
    },
    template: `
      <div :style="parentStyles">
        <VerticalModal :opened="true">
          <VerticalModalCart>
            111<br />111<br />111<br />111<br />111<br />111
          </VerticalModalCart>
      
          <VerticalModalForm>
            222
          </VerticalModalForm>
        </VerticalModal>
      </div>
    `,
  }))
  .add('loading', () => ({
    components: { VerticalModal, VerticalModalCart, VerticalModalForm },
    data() {
      return { parentStyles };
    },
    template: `
      <div :style="parentStyles">
        <VerticalModal :opened="true">
          <VerticalModalCart :isLoading="true">
            111<br />111<br />111<br />111<br />111<br />111
          </VerticalModalCart>
      
          <VerticalModalForm :isLoading="true">
            222
          </VerticalModalForm>
        </VerticalModal>
      </div>
    `,
  }))
  .add('order error', () => ({
    components: { VerticalModal, OrderCreationError },
    data() {
      return { parentStyles };
    },
    template: `
      <div :style="parentStyles">
        <VerticalModal :opened="true">
          <OrderCreationError type="unknownError" />
        </VerticalModal>
      </div>
    `,
  }));
