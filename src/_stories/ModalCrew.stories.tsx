/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Button, ModalCrew } from 'components';
import { useDisclosure } from '@chakra-ui/core';

export default {
  title: 'Components/ModalCrew',
  component: ModalCrew,
};

export function Default() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div css={{ height: '100vh', width: '100vw' }}>
      <Button css={{ color: 'black' }} onClick={onOpen}>
        Open modal
      </Button>
      <ModalCrew
        isOpen={isOpen}
        onClose={onClose}
        crew={[
          {
            id: 123,
            name: 'Kay Totleben',
            imageSrc: require('../_stories/assets/user.jpg'),
          },
          { id: 456, name: 'Mónica Ribeiro' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
          { id: 789, name: 'Elise Beverley' },
        ]}
      />
    </div>
  );
}
