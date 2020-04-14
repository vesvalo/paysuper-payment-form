/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import Modal from '@/components/Modal.vue';
import ModalCart from '@/components/ModalCart.vue';
import ModalForm from '@/components/ModalForm.vue';
import OrderCreationResult from '@/components/OrderCreationResult.vue';
import AnimationsOff from '@/components/AnimationsOff.vue';

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
  .add('longProjectName', () => ({
    components: { Modal, ModalCart, ModalForm },
    template: `
      <Modal :opened="true">
        <ModalCart projectName="ProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProject">
          111<br />111<br />111<br />111<br />111<br />111
        </ModalCart>
    
        <ModalForm>
          222
        </ModalForm>
      </Modal>
    `,
  }))
  .add('loading', () => ({
    components: {
      AnimationsOff, Modal, ModalCart, ModalForm,
    },
    template: `
      <AnimationsOff>
        <Modal :opened="true">
          <ModalCart :isLoading="true" projectName="Test">
            111<br />111<br />111<br />111<br />111<br />111
          </ModalCart>
      
          <ModalForm :isLoading="true">
            222
          </ModalForm>
        </Modal>
      </AnimationsOff>
    `,
  }))
  .add('order error', () => ({
    components: { AnimationsOff, Modal, OrderCreationResult },
    template: `
      <AnimationsOff>
        <Modal :opened="true">
          <OrderCreationResult type="unknownError" />
        </Modal>
      </AnimationsOff>
    `,
  }));
