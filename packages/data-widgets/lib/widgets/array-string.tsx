import React, { useEffect } from 'react';
import { Box, IconButton, List, ListItem, Flex, Input } from '@chakra-ui/react';
import {
  CollecticonPlusSmall,
  CollecticonTrashBin
} from '@devseed-ui/collecticons-chakra';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { SchemaFieldArray, WidgetProps } from '@stac-manager/data-core';

export function WidgetArrayString(props: WidgetProps) {
  const { pointer } = props;
  const field = props.field as SchemaFieldArray;

  const { fields, append, remove } = useFieldArray({
    name: pointer
  });

  const { register } = useFormContext();

  useEffect(() => {
    if (!fields.length) {
      const toAdd = (field.minItems || 0) - fields.length;
      const items = Array.from({ length: toAdd }).map(() => ({}));
      append(items);
    }
  }, []);

  const minItems = field.minItems || 0;
  const maxItems = field.maxItems || Infinity;
  const isFixed = minItems === maxItems;

  return (
    <Box as='fieldset' bg='base.100a' p={4}>
      <Flex as='legend' gap={4}>
        {!isFixed && (
          <IconButton
            colorScheme='blue'
            size='xs'
            onClick={() => {
              append({ value: '' });
            }}
            aria-label='Add item'
            icon={<CollecticonPlusSmall />}
            isDisabled={fields.length >= maxItems}
          />
        )}
        {field.label}
      </Flex>

      {fields.length ? (
        <List>
          {fields.map((item, index) => (
            <ListItem key={item.id} display='flex'>
              <Input
                key={item.id}
                size='sm'
                {...register(`${pointer}.${index}.value`)}
              />
              {!isFixed && (
                <IconButton
                  colorScheme='danger'
                  size='xs'
                  onClick={() => {
                    remove(index);
                  }}
                  aria-label='Remove item'
                  icon={<CollecticonTrashBin />}
                  isDisabled={fields.length <= minItems}
                />
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <p>No items</p>
      )}
    </Box>
  );
}
