import React from 'react';
import {
  Box,
  IconButton,
  List,
  ListItem,
  Flex,
  Input,
  Button
} from '@chakra-ui/react';
import {
  CollecticonPlusSmall,
  CollecticonTrashBin
} from '@devseed-ui/collecticons-chakra';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  SchemaFieldArray,
  schemaToDataStructure,
  WidgetProps
} from '@stac-manager/data-core';

export function WidgetArrayString(props: WidgetProps) {
  const { pointer } = props;
  const field = props.field as SchemaFieldArray;

  const { fields, append, remove } = useFieldArray({
    name: pointer,
    shouldUnregister: true
  });

  const { register } = useFormContext();

  const minItems = field.minItems || 0;
  const maxItems = field.maxItems || Infinity;
  const isFixed = minItems === maxItems;

  return (
    <Box as='fieldset' bg='base.50a' p={4} borderRadius='md'>
      <Flex as='legend' gap={4}>
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
      {!isFixed && (
        <Button
          colorScheme='base'
          size='sm'
          onClick={() => {
            append({ value: schemaToDataStructure(field.items) });
          }}
          aria-label='Add another'
          leftIcon={<CollecticonPlusSmall />}
          isDisabled={fields.length >= maxItems}
        >
          Add another
        </Button>
      )}
    </Box>
  );
}
