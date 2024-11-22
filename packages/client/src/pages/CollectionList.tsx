import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  TableContainer,
  Table,
  Button,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Heading,
  Flex
} from '@chakra-ui/react';
import { useCollections } from '@developmentseed/stac-react';
import type { StacCollection } from 'stac-ts';
import { Loading } from '../components';
import { usePageTitle } from '../hooks';

function CollectionList() {
  usePageTitle('Collections');
  const navigate = useNavigate();
  const { collections, state } = useCollections();

  return (
    <Flex direction='column' gap={8}>
      <Flex alignItems='center' justifyContent='space-between'>
        <Heading>Collections</Heading>
        <Button
          as={NavLink}
          to='/collections/new'
          colorScheme='primary'
          size='sm'
        >
          New Collection
        </Button>
      </Flex>
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
