/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Button, ModalConfirmDelete } from 'components';
import { useDisclosure } from '@chakra-ui/core';

export default {
  title: 'Components/ModalConfirmDelete',
  component: ModalConfirmDelete,
};

export function Default() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div css={{ height: '100vh', width: '100vw' }}>
      <Button css={{ color: 'black' }} onClick={onOpen}>
        Open modal
      </Button>
      <ModalConfirmDelete
        isOpen={isOpen}
        onClose={onClose}
        header={'Confirm deletion?'}
        entityName={'vessel'}
        entityID={123}
        body={
          'Are you sure you wish to remove the vessel ‘M.V Anatoki’ from the system? This can not be undone and will remove all data related to the vessel, including documents, logs uploads.'
        }
      />
    </div>
  );
}
