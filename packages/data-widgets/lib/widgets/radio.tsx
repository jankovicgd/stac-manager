import React from 'react';
import { FormControl, FormLabel, Radio, RadioGroup } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { SchemaFieldString, WidgetProps } from '@stac-manager/data-core';

import { FieldLabel } from './elements';

export function WidgetRadio(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldString;

  const { register } = useFormContext();

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
          <Radio key={label} value={value} {...register(pointer)}>
            {label}
          </Radio>
        ))}
      </RadioGroup>
    </FormControl>
  );
}
