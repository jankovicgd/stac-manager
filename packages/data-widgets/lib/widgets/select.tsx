import React from 'react';
import { Select, FormControl, FormLabel } from '@chakra-ui/react';
import { SchemaFieldString, WidgetProps } from '@stac-manager/data-core';
import { FastField } from 'formik';

import { FieldLabel } from '../components/elements';

export function WidgetSelect(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldString;

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
      <FastField
        as={Select}
        type='select'
        name={pointer}
        placeholder='Select option'
        size='sm'
      >
        {field.enum.map(([label, value]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </FastField>
    </FormControl>
  );
}
