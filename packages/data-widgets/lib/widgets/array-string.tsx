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
import {
  SchemaFieldArray,
  schemaToFormDataStructure,
  WidgetProps
} from '@stac-manager/data-core';
import { FastField, FieldArray, useFormikContext } from 'formik';
import { get } from 'lodash-es';

import { getArrayLabel } from '../utils';
import { ArrayFieldset, FieldLabel } from './elements';

export function WidgetArrayString(props: WidgetProps) {
  const { pointer } = props;
  const field = props.field as SchemaFieldArray;

  const { values } = useFormikContext();
  const fields: any[] = get(values, pointer) || [];

  const minItems = field.minItems || 0;
  const maxItems = field.maxItems || Infinity;
  const isFixed = minItems === maxItems;

  return (
    <FieldArray
      name={pointer}
      render={({ remove, push }) => (
        <ArrayFieldset
          label={field.label}
          onAdd={
            isFixed
              ? undefined
              : () => {
                  push(schemaToFormDataStructure(field.items));
                }
          }
          addDisabled={fields.length >= maxItems}
        >
          {fields.length ? (
            <List display='flex' gap={4} flexDir={isFixed ? 'row' : 'column'}>
              {fields.map((_, index) => (
                <ListItem
                  key={index /* eslint-disable-line react/no-array-index-key */}
                  display='flex'
                  width='100%'
                >
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
                    <FastField
                      as={Input}
                      size='sm'
                      name={`${pointer}.${index}`}
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
      )}
    />
  );
}
