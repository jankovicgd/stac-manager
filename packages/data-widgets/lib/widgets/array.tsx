import React from 'react';
import { List, ListItem } from '@chakra-ui/react';
import { useFieldArray } from 'react-hook-form';
import {
  WidgetRenderer,
  SchemaFieldArray,
  WidgetProps,
  schemaToDataStructure
} from '@stac-manager/data-core';
import { getArrayLabel } from '../utils';
import {
  ArrayFieldset // Import ArrayFieldset from elements
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

  // Check if the nested array is special like an array of strings (Checkboxes)
  // for example. Same logic as widget renderer.
  const isRegularNestedArray =
    items.type === 'array' && items.items.type !== 'string';

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
              {isRegularNestedArray ? (
                <ArrayItem
                  label={getArrayLabel(items, index)?.formatted}
                  pointer={`${pointer}.${index}.value`}
                  field={items as SchemaFieldArray}
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
