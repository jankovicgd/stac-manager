import React from 'react';
import { Checkbox, Flex, FormControl, FormLabel } from '@chakra-ui/react';
import { FastField, FastFieldProps } from 'formik';
import {
  SchemaFieldArray,
  SchemaFieldString,
  WidgetProps
} from '@stac-manager/data-core';

import { FieldLabel } from '../components/elements';

export function WidgetCheckbox(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldArray<SchemaFieldString>;

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
        {field.items.enum.map(([label, checkboxVal]) => (
          <FastField name={pointer} type='checkbox' key={label}>
            {({
              /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
              field: { value: groupValues, checked, ...fieldProps }
            }: FastFieldProps) => {
              return (
                <Checkbox
                  {...fieldProps}
                  size='sm'
                  value={checkboxVal}
                  isChecked={groupValues?.includes(checkboxVal)}
                >
                  {label}
                </Checkbox>
              );
            }}
          </FastField>
        ))}
      </Flex>
    </FormControl>
  );
}
