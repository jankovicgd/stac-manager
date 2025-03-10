import React from 'react';
import { Flex, Grid, SimpleGrid } from '@chakra-ui/react';

import { usePageTitle } from '../../hooks';
import { InnerPageHeader } from '$components/InnerPageHeader';
import ItemCard from '$components/ItemCard';

export default function Sandbox() {
  usePageTitle('Sandbox');

  return (
    <Flex direction='column' gap={8} p={4}>
      <InnerPageHeader overline='Sandbox' title='Sandbox' />
      <Flex direction='column' gap={8} p={4}>
        <p>This is the sandbox.</p>

        <SimpleGrid
          gap={8}
          templateColumns='repeat(auto-fill, minmax(18rem, 1fr))'
        >
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}
