import React from 'react';
import { FormControl, FormLabel, Radio, RadioGroup } from '@chakra-ui/react';
import { SchemaFieldString, WidgetProps } from '@stac-manager/data-core';
import { FastField } from 'formik';

import { FieldLabel } from '../components/elements';

export function WidgetRadio(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldString;

  if (!field.enum?.length) {
    throw new Error('WidgetRadio: enum is required');
  }

  return (
    <FormControl isRequired={isRequired}>
      {field.label && (
        <FormLabel>
          <FieldLabel size='xs'>{field.label}</FieldLabel>
        </FormLabel>
      )}
      <RadioGroup size='sm' gap={4} display='flex'>
        {field.enum.map(([label, value]) => (
          <FastField
            key={label}
            as={Radio}
            name={pointer}
            type='radio'
            value={value}
            size='sm'
          >
            {label}
          </FastField>
        ))}
      </RadioGroup>
    </FormControl>
  );
}
