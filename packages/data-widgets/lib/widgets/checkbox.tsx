import React from 'react';
import {
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { useField } from 'formik';
import {
  SchemaFieldArray,
  SchemaFieldString,
  WidgetProps
} from '@stac-manager/data-core';

import { FieldLabel } from '../components/elements';

export function WidgetCheckbox(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldArray<SchemaFieldString>;

  const [{ value }, , { setValue, setTouched }] = useField(pointer);

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
        <CheckboxGroup
          value={value}
          onChange={(v) => {
            setValue(v);
            setTouched(true);
          }}
        >
          {field.items.enum.map(([label, checkboxVal]) => (
            <Checkbox key={label} size='sm' value={checkboxVal}>
              {label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </Flex>
    </FormControl>
  );
}
