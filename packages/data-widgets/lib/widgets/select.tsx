import React from 'react';
import { Select, FormControl, FormLabel } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { SchemaFieldString, WidgetProps } from '@stac-manager/data-core';

import { FieldLabel } from './elements';

export function WidgetSelect(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldString;

  const { register } = useFormContext();

  if (!field.enum?.length) {
    throw new Error('WidgetSelect: enum is required');
  }

  return (
    <FormControl isRequired={isRequired}>
      {field.label && (
        <FormLabel>
          <FieldLabel size='xs'>{field.label}</FieldLabel>
        </FormLabel>
      )}
      <Select placeholder='Select option' size='sm' {...register(pointer)}>
        {field.enum.map(([label, value]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
