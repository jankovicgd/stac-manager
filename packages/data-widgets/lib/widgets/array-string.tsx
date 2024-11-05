import React from 'react';
import {
  IconButton,
  List,
  ListItem,
  Input,
  FormControl,
  FormLabel,
  Box,
  Flex
} from '@chakra-ui/react';
import { CollecticonTrashBin } from '@devseed-ui/collecticons-chakra';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  SchemaFieldArray,
  schemaToDataStructure,
  WidgetProps
} from '@stac-manager/data-core';
import { getArrayLabel } from '../utils';
import { ArrayFieldset, FieldLabel } from './elements';

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
    <ArrayFieldset
      label={field.label}
      onAdd={
        isFixed
          ? undefined
          : () => {
              append({ value: schemaToDataStructure(field.items) });
            }
      }
      addDisabled={fields.length >= maxItems}
    >
      {fields.length ? (
        <List display='flex' gap={4} flexDir={isFixed ? 'row' : 'column'}>
          {fields.map((item, index) => (
            <ListItem key={item.id} display='flex' width='100%'>
              <FormControl>
                <Flex gap={4} justifyContent='space-between'>
                  <FormLabel>
                    <FieldLabel size='xs'>
                      {getArrayLabel(field.items, index)?.formatted}
                    </FieldLabel>
                  </FormLabel>
                  <Box>
                    {!isFixed && (
                      <IconButton
                        colorScheme='base'
                        variant='soft-outline'
                        size='xs'
                        onClick={() => {
                          remove(index);
                        }}
                        aria-label='Remove item'
                        icon={<CollecticonTrashBin />}
                        isDisabled={fields.length <= minItems}
                      />
                    )}
                  </Box>
                </Flex>
                <Input
                  size='sm'
                  {...register(`${pointer}.${index}.value`)}
                  bg='surface.500'
                  borderColor='base.200'
                  borderRadius='md'
                />
              </FormControl>
            </ListItem>
          ))}
        </List>
      ) : (
        <p>No items</p>
      )}
    </ArrayFieldset>
  );
}
