import React, { useEffect } from 'react';
import { Box, IconButton, List, ListItem } from '@chakra-ui/react';
import {
  CollecticonPlusSmall,
  CollecticonTrashBin
} from '@devseed-ui/collecticons-chakra';
import { useFieldArray } from 'react-hook-form';
import {
  WidgetRenderer,
  SchemaFieldArray,
  WidgetProps
} from '@stac-manager/data-core';

export function WidgetArray(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldArray;

  const { fields, append, remove } = useFieldArray({
    name: pointer
  });

  useEffect(() => {
    if (!fields.length) {
      const toAdd = (field.minItems || 0) - fields.length;
      const items = Array.from({ length: toAdd }).map(() => ({}));
      append(items);
    }
  }, []);

  const minItems = field.minItems || 0;
  const maxItems = field.maxItems || Infinity;

  return (
    <Box as='fieldset' p={4} bg='base.100a'>
      <Box as='legend' display='flex' w='100%' alignItems='center' gap={4}>
        <IconButton
          colorScheme='primary'
          size='xs'
          onClick={() => {
            append({});
          }}
          aria-label='Add item'
          icon={<CollecticonPlusSmall />}
          isDisabled={fields.length >= maxItems}
        />
        {field.label}
      </Box>
      {fields.length ? (
        <List display='flex' flexFlow='column' gap={4}>
          {fields.map((item, index) => (
            <ListItem key={item.id}>
              <IconButton
                colorScheme='danger'
                size='xs'
                onClick={() => {
                  remove(index);
                }}
                aria-label='Remove item'
                icon={<CollecticonTrashBin />}
                isDisabled={fields.length <= minItems}
              />{' '}
              Item #{index + 1}
              <Box p={4}>
                <WidgetRenderer
                  pointer={`${pointer}.${index}`}
                  field={field.items}
                  isRequired={isRequired}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <p>No items</p>
      )}
    </Box>
  );
}
