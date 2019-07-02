/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import Modal from '@/components/Modal.vue';
import ModalCart from '@/components/ModalCart.vue';
import ModalForm from '@/components/ModalForm.vue';
import OrderCreationError from '@/components/OrderCreationError.vue';

storiesOf('Modal', module)
  .add('default', () => ({
    components: { Modal, ModalCart, ModalForm },
    template: `
      <Modal :opened="true">
        <ModalCart projectName="Test">
          111<br />111<br />111<br />111<br />111<br />111
        </ModalCart>
    
        <ModalForm>
          222
        </ModalForm>
      </Modal>
    `,
  }))
  .add('loading', () => ({
    components: { Modal, ModalCart, ModalForm },
    template: `
      <Modal :opened="true">
        <ModalCart :isLoading="true" projectName="Test">
          111<br />111<br />111<br />111<br />111<br />111
        </ModalCart>
    
        <ModalForm :isLoading="true">
          222
        </ModalForm>
      </Modal>
    `,
  }))
  .add('order error', () => ({
    components: { Modal, OrderCreationError },
    template: `
      <Modal :opened="true">
        <OrderCreationError type="unknownError" />
      </Modal>
    `,
  }));
