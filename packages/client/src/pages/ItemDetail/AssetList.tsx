import React from 'react';
import {
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid
} from '@chakra-ui/react';
import { StacAsset } from 'stac-ts';
import StacFields from '@radiantearth/stac-fields';
import {
  CollecticonEllipsisVertical,
  CollecticonLink
} from '@devseed-ui/collecticons-chakra';
import { zeroPad } from '$utils/format';
import { ItemCard } from '$components/ItemCard';
import SmartLink from '$components/SmartLink';

type AssetProps = {
  assetKey: string;
  asset: StacAsset & {
    alternate?: { [key: string]: Alternate };
  };
};

type Alternate = {
  href: string;
  title?: string;
  description?: string;
};

function Asset({ asset, assetKey }: AssetProps) {
  const { title, description, roles, type, href, alternate } = asset;
  const formattedProperties = StacFields.formatAsset({ type })[0].properties;

  return (
    <ItemCard
      title={title || assetKey}
      subtitle={formattedProperties.type.formatted}
      description={description}
      tags={roles}
      renderMenu={() => {
        return alternate ? (
          <Menu placement='bottom-end'>
            <MenuButton
              as={IconButton}
              aria-label='Download options'
              icon={<CollecticonEllipsisVertical />}
              variant='outline'
              size='sm'
            />
            <MenuList>
              {Object.entries(alternate).map(
                ([key, val]: [string, Alternate]) => (
                  <MenuItem key={key} as={SmartLink} to={val.href}>
                    {val.title || val.href}
                  </MenuItem>
                )
              )}
            </MenuList>
          </Menu>
        ) : (
          <IconButton
            as={SmartLink}
            to={href}
            aria-label='Download'
            icon={<CollecticonLink />}
            variant='outline'
            size='sm'
          />
        );
      }}
    />
  );
}

type AssetListProps = {
  assets: { [key: string]: StacAsset };
};

function AssetList({ assets }: AssetListProps) {
  const assetsList = Object.entries(assets);
  return (
    <Flex direction='column' gap='8' as='section'>
      <Flex direction='row' px='8' gap='8' as='header'>
        <Box flexBasis='100%'>
          <Heading size='md' as='h2'>
            Assets <Badge variant='solid'>{zeroPad(assetsList.length)}</Badge>
          </Heading>
        </Box>
      </Flex>

      <SimpleGrid
        gap={8}
        templateColumns='repeat(auto-fill, minmax(20rem, 1fr))'
      >
        {assetsList.map(([key, asset]) => (
          <Asset key={key} asset={asset} assetKey={key} />
        ))}
      </SimpleGrid>
    </Flex>
  );
}

export default AssetList;
