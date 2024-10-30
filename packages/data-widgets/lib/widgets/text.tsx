import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { SchemaFieldString, WidgetProps } from '@stac-manager/data-core';

export function WidgetText(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldString;

  const { register } = useFormContext();

  return (
    <FormControl isRequired={isRequired}>
      {field.label && <FormLabel>{field.label}</FormLabel>}
      <Input size='sm' {...register(pointer)} />
    </FormControl>
  );
}
