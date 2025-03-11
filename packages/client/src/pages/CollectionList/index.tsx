import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TableContainer,
  Table,
  Button,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Flex,
  Heading,
  Box,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Select
} from '@chakra-ui/react';
import { CollecticonMagnifierRight, CollecticonPlusSmall } from '@devseed-ui/collecticons-chakra';
import { useCollections } from '@developmentseed/stac-react';
import type { StacCollection } from 'stac-ts';

import { Loading } from '../../components';
import { usePageTitle } from '../../hooks';
import { InnerPageHeader } from '$components/InnerPageHeader';
import SmartLink from '$components/SmartLink';
import ItemCard from '$components/ItemCard';

function CollectionList() {
  usePageTitle('Collections');
  const navigate = useNavigate();
  const { collections, state } = useCollections();

  return (
    <Flex direction='column' gap={8} p={4}>
      <InnerPageHeader
        title='Catalog'
        overline='Browsing'
        actions={
          <Button
            as={SmartLink}
            to='/collections/new'
            colorScheme='primary'
            size='md'
            leftIcon={<CollecticonPlusSmall />}
          >
            Create
          </Button>
        }
      />
      <Flex direction='column' as='section'>
        <Flex direction='row' px='8' gap='8' as='header'>
          <Box flexBasis='100%'>
            <Heading size='md' as='h2'>
              Collections
            </Heading>
          </Box>
          <Flex direction='row' gap='4'>
            <Flex direction='row' gap='2' alignItems='center'>
              <Heading size='xs' as='h3'>
                Search
              </Heading>
              <InputGroup width='16rem'>
                <Input type='search' placeholder='Title or description' />
                <InputRightElement pointerEvents='none'>
                  <CollecticonMagnifierRight />
                </InputRightElement>
              </InputGroup>
            </Flex>

            <Flex direction='row' gap='2' alignItems='center'>
              <Heading size='xs' as='h3'>
                Filter
              </Heading>
              <Select placeholder='All keywords' size='md' width='12rem' />
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <SimpleGrid
        gap={8}
        templateColumns='repeat(auto-fill, minmax(26rem, 1fr))'
      >
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </SimpleGrid>

      <TableContainer>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th aria-label='Actions' />
            </Tr>
          </Thead>
          <Tbody>
            {!collections || state === 'LOADING' ? (
              <Tr>
                <Td colSpan={2}>
                  <Loading>Loading collections...</Loading>
                </Td>
              </Tr>
            ) : (
              collections.collections.map(({ id }: StacCollection) => (
                <Tr
                  key={id}
                  onClick={() => navigate(`/collections/${id}/`)}
                  _hover={{ cursor: 'pointer', bgColor: 'gray.50' }}
                >
                  <Td>{id}</Td>
                  <Td fontSize='sm'>
                    <Link
                      to={`/collections/${id}/`}
                      aria-label={`View collection ${id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View
                    </Link>{' '}
                    |{' '}
                    <Link
                      to={`/collections/${id}/edit/`}
                      aria-label={`Edit collection ${id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Link>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}

export default CollectionList;
