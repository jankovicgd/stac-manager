import React from 'react';
import { Flex } from '@chakra-ui/react';

import { usePageTitle } from '../../hooks';
import { InnerPageHeader } from '$components/InnerPageHeader';

export default function Sandbox() {
  usePageTitle('Sandbox');

  return (
    <Flex direction='column' gap={8} p={4}>
      <InnerPageHeader overline='Sandbox' title='Sandbox' />
      <Flex direction='column' gap={8} p={4}>
        <p>This is the sandbox.</p>
      </Flex>
    </Flex>
  );
}
