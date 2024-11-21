import React, { useMemo } from 'react';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { useField } from 'formik';
import ReactSelect from 'react-select';
import {
  SchemaFieldArray,
  SchemaFieldString,
  WidgetProps
} from '@stac-manager/data-core';

import { FieldLabel } from '../components/elements';
import { castArray } from '../utils';

interface Option {
  readonly label: string;
  readonly value: string;
}

export function WidgetSelect(props: WidgetProps) {
  const { pointer, isRequired, field } = props;

  const isMulti = field.type === 'array';

  if (
    isMulti
      ? !(field as SchemaFieldArray<SchemaFieldString>).items?.enum?.length
      : !(field as SchemaFieldString).enum?.length
  ) {
    throw new Error('WidgetSelect: enum is required');
  }

  const options = useMemo(() => {
    const enums = isMulti
      ? (field as SchemaFieldArray<SchemaFieldString>).items?.enum
      : (field as SchemaFieldString).enum;

    return enums!.map<Option>(([value, label]) => ({
      value,
      label
    }));
  }, [field]);

  const [{ value }, , { setValue }] = useField(pointer);

  const selectedOpts = options.filter((option) =>
    castArray(value).includes(option.value)
  );

  return (
    <FormControl isRequired={isRequired}>
      {field.label && (
        <FormLabel>
          <FieldLabel size='xs'>{field.label}</FieldLabel>
        </FormLabel>
      )}
      <ReactSelect
        name={pointer}
        options={options}
        isMulti={isMulti}
        isClearable={!isRequired}
        onChange={(option) => {
          if (option) {
            setValue(
              castArray(option as Option | Option[]).map((o) => o.value)
            );
          } else {
            setValue(isMulti ? [] : undefined);
          }
        }}
        value={selectedOpts}
      />
    </FormControl>
  );
}
