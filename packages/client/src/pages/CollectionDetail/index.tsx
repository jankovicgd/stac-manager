import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  ListItem,
  Text,
  List,
  Tag,
  Icon,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Heading,
  Badge,
  Grid,
  GridItem,
  HStack,
  VisuallyHidden
} from '@chakra-ui/react';
import { MdAccessTime, MdBalance, MdEdit } from 'react-icons/md';
import { useCollection, useStacSearch } from '@developmentseed/stac-react';
import {
  CollecticonEllipsisVertical,
  CollecticonPencil,
  CollecticonPlusSmall,
  CollecticonTrashBin
} from '@devseed-ui/collecticons-chakra';
import { StacCollection } from 'stac-ts';

import { Loading } from '../../components';
import { usePageTitle } from '../../hooks';
import ItemResults from '../../components/ItemResults';
import CollectionMap from './CollectionMap';
import SmartLink from '$components/SmartLink';
import { InnerPageHeader } from '$components/InnerPageHeader';
import { StacBrowserMenuItem } from '$components/StacBrowserMenuItem';
import ItemCard from '$components/ItemCard';

const dateFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

function CollectionDetail() {
  const { collectionId } = useParams();
  usePageTitle(`Collection ${collectionId}`);
  const { collection, state } = useCollection(collectionId!); // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const { results, collections, setCollections, submit, ...stacSearch } =
    useStacSearch();

  // Initialize the search with the current collection ID
  useEffect(() => {
    setCollections([collectionId]);
  }, [collectionId, setCollections]);

  // Automatically submit whenever the collection ID changes
  useEffect(() => {
    if (!collections) return;
    submit();
  }, [collections, submit]);

  const dateLabel = useMemo(() => {
    if (!collection) {
      return;
    }

    const [fromDate, toDate] = collection.extent.temporal.interval[0];
    const fromLabel =
      fromDate && new Date(fromDate).toLocaleString('en-GB', dateFormat);
    const toLabel =
      toDate && new Date(toDate).toLocaleString('en-GB', dateFormat);

    if (fromLabel && toLabel) {
      return `${fromLabel} – ${toLabel}`;
    }

    if (fromLabel) {
      return `From: ${fromLabel}`;
    }

    if (toLabel) {
      return `To: ${toLabel}`;
    }

    return '—';
  }, [collection]);

  if (!collection || state === 'LOADING') {
    return <Loading>Loading collection...</Loading>;
  }

  const { id, title, description, keywords, license } =
    collection as StacCollection;

  return (
    <Flex direction='column' gap={8}>
      <InnerPageHeader
        overline='Viewing Collection'
        title={id}
        actions={
          <>
            <Button
              as={SmartLink}
              to={`/collections/${id}/edit`}
              colorScheme='primary'
              size='md'
              leftIcon={<CollecticonPencil />}
            >
              Edit
            </Button>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<CollecticonEllipsisVertical />}
                variant='outline'
                size='md'
              />
              <MenuList>
                <StacBrowserMenuItem resourcePath={`/collections/${id}`} />
                <MenuItem
                  icon={<CollecticonTrashBin />}
                  color='danger.500'
                  _hover={{ bg: 'danger.200' }}
                  _focus={{ bg: 'danger.200' }}
                  onClick={() => alert('Soon!')}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        }
      />

      <Flex direction='column' gap='8' as='section'>
        <Flex direction='row' px='8' gap='8' as='header'>
          <Box flexBasis='100%'>
            <Heading size='md' as='h2'>
              Overview
            </Heading>
          </Box>
        </Flex>

        <Grid templateColumns='repeat(12, 1fr)' gap={8}>
          <GridItem colSpan={8}>
            <Flex
              bg='base.50'
              borderRadius='md'
              p={8}
              direction='column'
              gap={4}
              minH='100%'
            >
              <Flex direction='column' gap='2'>
                <Heading size='sm' as='h3'>
                  Description
                </Heading>
                <Text size='md'>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non
                  impedit vitae tempore repellat neque sunt aut, veniam facere,
                  corporis nihil voluptas quis quia magni.
                </Text>
              </Flex>

              <Flex direction='column' gap='2'>
                <Heading size='sm' as='h3'>
                  Temporal extent
                </Heading>
                <Text size='md'>2020-12-01 16:50:26 UTC</Text>
              </Flex>

              <Flex direction='column' gap='2'>
                <Heading size='sm' as='h3'>
                  License
                </Heading>
                <Text size='md'>CC-BY-4.0</Text>
              </Flex>

              <Flex direction='column' gap='2'>
                <Heading size='sm' as='h3'>
                  Keywords
                </Heading>
                <HStack spacing={2}>
                  <Tag size='md' colorScheme='primary' as='a' href='#'>
                    Tag
                  </Tag>
                  <Tag size='md' colorScheme='primary' as='a' href='#'>
                    Tag
                  </Tag>
                  <Tag size='md' colorScheme='primary' as='a' href='#'>
                    Tag
                  </Tag>
                  <Tag size='md' colorScheme='primary' as='a' href='#'>
                    Tag
                  </Tag>
                </HStack>
              </Flex>
            </Flex>
          </GridItem>
          <GridItem colSpan={4}>
            <Flex
              bg='base.50'
              borderRadius='md'
              p={8}
              direction='column'
              gap={2}
              position='relative'
              overflow='hidden'
              height='20rem'
            >
              <Heading size='sm' as='h3'>
                <VisuallyHidden>Spacial extent</VisuallyHidden>
              </Heading>
              <Box position='absolute' inset='0'>
                <CollectionMap collection={collection} />
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Flex>

      <Flex direction='column' gap='8' as='section'>
        <Flex direction='row' px='8' gap='8' as='header'>
          <Box flexBasis='100%'>
            <Heading size='md' as='h2'>
              Items <Badge variant='solid'>04</Badge>
            </Heading>
          </Box>
          <Flex direction='row' gap='4'>
            <Button
              as={SmartLink}
              to='/item/new'
              colorScheme='primary'
              size='md'
              leftIcon={<CollecticonPlusSmall />}
            >
              Add new
            </Button>
          </Flex>
        </Flex>

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

      <Box
        display='grid'
        gap='8'
        gridTemplateColumns='2fr 1fr'
        borderBottom='1px solid'
        borderColor='gray.200'
        pb='8'
      >
        <Box height='250px'>
          <CollectionMap collection={collection} />
        </Box>
        <Box fontSize='sm'>
          <Box display='flex' gap='4' alignItems='baseline'>
            <Text as='h2' fontSize='md' my='0' flex='1'>
              About
            </Text>
            <Link to='edit/' title='Edit collection'>
              <Icon as={MdEdit} boxSize='4' />
            </Link>
          </Box>
          {(title || description) && (
            <Text mt='0'>
              {title && <Text as='b'>{title} </Text>}
              {description}
            </Text>
          )}
          <Box color='gray.600' my='4'>
            <Box display='flex' gap='1' alignItems='center' mb='1'>
              <Icon color='gray.600' as={MdAccessTime} boxSize='4' />
              <Text m='0'>{dateLabel}</Text>
            </Box>
            <Box display='flex' gap='1' alignItems='center' mb='1'>
              <Icon color='gray.600' as={MdBalance} boxSize='4' />
              <Text m='0'>{license}</Text>
            </Box>
          </Box>
          {keywords && keywords.length > 0 && (
            <List mt='1'>
              {keywords.map((keyword) => (
                <Tag mr='1' as={ListItem} key={keyword}>
                  {keyword}
                </Tag>
              ))}
            </List>
          )}
        </Box>
      </Box>

      <Text as='h2'>Items in this collection</Text>
      <ItemResults results={results} submit={submit} {...stacSearch} />
    </Flex>
  );
}

export default CollectionDetail;
