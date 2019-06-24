/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import Modal from '@/components/Modal.vue';
import ModalCart from '@/components/ModalCart.vue';
import ModalForm from '@/components/ModalForm.vue';

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
  }));
