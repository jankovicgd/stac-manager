import React from 'react';
import { FormControl, FormLabel, Radio, RadioGroup } from '@chakra-ui/react';
import { SchemaFieldString, WidgetProps } from '@stac-manager/data-core';
import { useField } from 'formik';

import { FieldLabel } from '../components/elements';

export function WidgetRadio(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldString;

  const [{ value }, , { setValue, setTouched }] = useField<string>(pointer);

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
      <RadioGroup
        size='sm'
        gap={4}
        display='flex'
        value={value}
        onChange={(v) => {
          setValue(v);
          setTouched(true);
        }}
      >
        {field.enum.map(([label, radioValue]) => (
          <Radio key={label} size='sm' value={radioValue}>
            {label}
          </Radio>
        ))}
      </RadioGroup>
    </FormControl>
  );
}
