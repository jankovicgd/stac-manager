import React from 'react';
import { Box, Button, List, ListItem } from '@chakra-ui/react';
import { CollecticonPlusSmall } from '@devseed-ui/collecticons-chakra';
import { useFieldArray } from 'react-hook-form';
import {
  WidgetRenderer,
  SchemaFieldArray,
  WidgetProps,
  schemaToDataStructure
} from '@stac-manager/data-core';
import { getArrayLabel } from '../utils';
import {
  Fieldset,
  FieldsetBody,
  FieldsetDeleteBtn,
  FieldsetFooter,
  FieldsetHeader,
  FieldsetLabel
} from './elements';

export function WidgetArray(props: WidgetProps) {
  // const { pointer, isRequired } = props;
  const { pointer } = props;
  const field = props.field as SchemaFieldArray;

  return (
    <ArrayItem
      label={field.label}
      pointer={pointer}
      field={field}
      // isRequired={isRequired}
    />
  );
}

interface ArrayItemProps {
  label: React.ReactNode;
  field: SchemaFieldArray;
  pointer: string;
  onRemove?: () => void;
  removeDisabled?: boolean;
}

function ArrayItem(props: ArrayItemProps) {
  const { label, field, pointer, onRemove, removeDisabled } = props;

  const { fields, append, remove } = useFieldArray({
    name: pointer,
    shouldUnregister: true
  });

  const items = field.items;
  const minItems = field.minItems || 0;
  const maxItems = field.maxItems || Infinity;
  const isFixedCount = minItems === maxItems;

  return (
    <ArrayFieldset
      label={label}
      onRemove={onRemove}
      onAdd={
        isFixedCount
          ? undefined
          : () => {
              append({ value: schemaToDataStructure(items) });
            }
      }
      addDisabled={fields.length >= maxItems}
      removeDisabled={removeDisabled}
    >
      {fields.length ? (
        <List display='flex' flexDirection='column' gap={4}>
          {fields.map((item, index) => (
            <ListItem key={item.id}>
              {items.type === 'array' ? (
                <ArrayItem
                  label={getArrayLabel(items, index)?.formatted}
                  pointer={`${pointer}.${index}.value`}
                  field={items}
                  onRemove={
                    isFixedCount
                      ? undefined
                      : () => {
                          remove(index);
                        }
                  }
                  removeDisabled={fields.length <= minItems}
                />
              ) : (
                <ArrayFieldset
                  label={getArrayLabel(items, index)?.formatted}
                  onRemove={
                    isFixedCount
                      ? undefined
                      : () => {
                          remove(index);
                        }
                  }
                  removeDisabled={fields.length <= minItems}
                >
                  <WidgetRenderer
                    pointer={`${pointer}.${index}.value`}
                    field={items}
                    isRequired={false}
                  />
                </ArrayFieldset>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <p>No items</p>
      )}
    </ArrayFieldset>
  );
}

interface ArrayFieldsetProps {
  label: React.ReactNode;
  children: React.ReactNode;
  onRemove?: () => void;
  onAdd?: () => void;
  addDisabled?: boolean;
  removeDisabled?: boolean;
}

function ArrayFieldset(props: ArrayFieldsetProps) {
  const { label, children, onRemove, onAdd, addDisabled, removeDisabled } =
    props;

  return (
    <Fieldset>
      <FieldsetHeader>
        <Box>
          <FieldsetLabel>{label}</FieldsetLabel>
        </Box>
        {onRemove && (
          <Box>
            <FieldsetDeleteBtn
              onClick={onRemove}
              isDisabled={removeDisabled}
              aria-label='Remove item'
            />
          </Box>
        )}
      </FieldsetHeader>
      <FieldsetBody>{children}</FieldsetBody>
      {onAdd && (
        <FieldsetFooter>
          <Button
            colorScheme='base'
            size='sm'
            onClick={onAdd}
            aria-label='Add item'
            leftIcon={<CollecticonPlusSmall />}
            isDisabled={addDisabled}
          >
            Add another
          </Button>
        </FieldsetFooter>
      )}
    </Fieldset>
  );
}
