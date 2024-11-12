import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { FastField } from 'formik';
import { SchemaFieldString, WidgetProps } from '@stac-manager/data-core';

import { FieldLabel } from './elements';

export function WidgetText(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldString;

  return (
    <FormControl isRequired={isRequired}>
      {field.label && (
        <FormLabel>
          <FieldLabel size='xs'>{field.label}</FieldLabel>
        </FormLabel>
      )}
      <FastField
        as={Input}
        size='sm'
        name={pointer}
        bg='surface.500'
        borderColor='base.200'
        borderRadius='md'
      />
    </FormControl>
  );
}
