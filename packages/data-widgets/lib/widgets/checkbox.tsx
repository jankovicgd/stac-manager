import React from 'react';
import { Checkbox, Flex, FormControl, FormLabel } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import {
  SchemaFieldArray,
  SchemaFieldString,
  WidgetProps
} from '@stac-manager/data-core';

import { FieldLabel } from './elements';

export function WidgetCheckbox(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldArray<SchemaFieldString>;

  const { register } = useFormContext();

  if (!field.items.enum?.length) {
    throw new Error('WidgetCheckbox: items.enum is required');
  }

  return (
    <FormControl isRequired={isRequired}>
      {field.label && (
        <FormLabel>
          <FieldLabel size='xs'>{field.label}</FieldLabel>
        </FormLabel>
      )}
      <Flex gap={4}>
        {field.items.enum.map(([label, value]) => (
          <Checkbox key={label} value={value} size='sm' {...register(pointer)}>
            {label}
          </Checkbox>
        ))}
      </Flex>
    </FormControl>
  );
}
