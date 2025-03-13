import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Text,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
  GridItem,
  Grid,
  VisuallyHidden,
  Skeleton,
  SkeletonText
} from '@chakra-ui/react';
import Map, { Source, Layer, MapRef } from 'react-map-gl/maplibre';
import { StacAsset } from 'stac-ts';
import { useItem } from '@developmentseed/stac-react';
import {
  CollecticonEllipsisVertical,
  CollecticonTrashBin
} from '@devseed-ui/collecticons-chakra';
import getBbox from '@turf/bbox';

import { usePageTitle } from '../../hooks';
import { BackgroundTiles } from '$components/Map';
import AssetList from './AssetList';
import { InnerPageHeader } from '$components/InnerPageHeader';
import { StacBrowserMenuItem } from '$components/StacBrowserMenuItem';

const resultsOutline = {
  'line-color': '#C53030',
  'line-width': 2
};

const resultsFill = {
  'fill-color': '#C53030',
  'fill-opacity': 0.1
};

const cogMediaTypes = [
  'image/tiff; application=geotiff; profile=cloud-optimized',
  'image/vnd.stac.geotiff'
];

const dateFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

function ItemDetail() {
  const { collectionId, itemId } = useParams();
  usePageTitle(`Item ${itemId}`);
  const itemResource = `${process.env.REACT_APP_STAC_API}/collections/${collectionId}/items/${itemId}`;
  const { item, state } = useItem(itemResource);

  const [map, setMap] = useState<MapRef>();
  const setMapRef = (m: MapRef) => setMap(m);

  // Fit the map view around the current results bbox
  useEffect(() => {
    const bounds = item && getBbox(item);

    if (map && bounds) {
      const [x1, y1, x2, y2] = bounds;
      map.fitBounds([x1, y1, x2, y2], { padding: 30, duration: 0 });
    }
  }, [item, map]);

  const previewAsset = useMemo(() => {
    if (!item) return;

    return Object.values(item.assets).reduce((preview, asset) => {
      const { type, href, roles } = asset as StacAsset;
      if (cogMediaTypes.includes(type || '')) {
        if (!preview) {
          return href;
        } else {
          if (roles && roles.includes('visual')) {
            return href;
          }
        }
      }
      return preview;
    }, undefined);
  }, [item]);

  if (!item || state === 'LOADING') {
    return (
      <Box p={8}>
        <Flex direction='column' gap={4}>
          <Skeleton h={6} maxW='25rem' />
          <Skeleton h={12} maxW='30rem' />
        </Flex>

        <SkeletonText
          mt={8}
          noOfLines={4}
          spacing='4'
          skeletonHeight='2'
          maxW='50rem'
        />
      </Box>
    );
  }

  const { title, description, ...properties } = item.properties;

  return (
    <Flex direction='column' gap={8}>
      <InnerPageHeader
        overline='Viewing Item'
        title={title || item.id}
        actions={
          <>
            {/* <Button
              as={SmartLink}
              to={`/collections/${properties.collection}/items/${properties.id}/edit`}
              colorScheme='primary'
              size='sm'
              leftIcon={<CollecticonPencil />}
            >
              Edit
            </Button> */}
            <Menu placement='bottom-end'>
              <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<CollecticonEllipsisVertical />}
                variant='outline'
                size='md'
              />
              <MenuList>
                <StacBrowserMenuItem
                  resourcePath={`/collections/${item.collection}/items/${item.id}`}
                />
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
                  Collection
                </Heading>
                <Text size='md'>{item.collection}</Text>
              </Flex>
              {description && (
                <Flex direction='column' gap='2'>
                  <Heading size='sm' as='h3'>
                    Description
                  </Heading>
                  <Text size='md'>{description} </Text>
                </Flex>
              )}
              {properties.datetime && (
                <Flex direction='column' gap='2'>
                  <Heading size='sm' as='h3'>
                    Date
                  </Heading>
                  <Text size='md'>
                    {new Date(properties.datetime).toLocaleString(
                      'en-GB',
                      dateFormat
                    )}
                  </Text>
                </Flex>
              )}
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
                <Map ref={setMapRef}>
                  <BackgroundTiles />
                  {previewAsset && (
                    <Source
                      id='preview'
                      type='raster'
                      tiles={[
                        `http://tiles.rdnt.io/tiles/{z}/{x}/{y}@2x?url=${previewAsset}`
                      ]}
                      tileSize={256}
                      attribution="Background tiles: © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
                    >
                      <Layer id='preview-tiles' type='raster' />
                    </Source>
                  )}
                  <Source id='results' type='geojson' data={item}>
                    <Layer
                      id='results-line'
                      type='line'
                      paint={resultsOutline}
                    />
                    {!previewAsset && (
                      <Layer
                        id='results-fill'
                        type='fill'
                        paint={resultsFill}
                      />
                    )}
                  </Source>
                </Map>
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Flex>

      <AssetList assets={item.assets} />
    </Flex>
  );
}

export default ItemDetail;
