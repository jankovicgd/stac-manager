import React, { KeyboardEventHandler, useMemo, useState } from 'react';
import { Kbd, FormControl, FormLabel } from '@chakra-ui/react';
import { useField } from 'formik';
import CreatableSelect from 'react-select/creatable';
import {
  SchemaFieldArray,
  SchemaFieldString,
  WidgetProps
} from '@stac-manager/data-core';

import { FieldLabel } from '../components/elements';

const components = {
  DropdownIndicator: null
};

const createOption = (label: string): Option => ({
  label,
  value: label
});

interface Option {
  readonly label: string;
  readonly value: string;
}

export function WidgetTagger(props: WidgetProps) {
  const { field } = props;

  if (field.type === 'string') {
    if (!field.enum) {
      throw new Error("WidgetTagger: 'enum' is required for string fields");
    }

    return <WidgetTaggerWithOptions {...props} />;
  }

  if (field.type === 'array' && field.items.type === 'string') {
    return field.items.enum ? (
      <WidgetTaggerWithOptions {...props} isMulti />
    ) : (
      <WidgetTaggerNoOptions {...props} />
    );
  }

  throw new Error(
    `WidgetTagger: Field type must be 'string' or 'array'. Got: ${field.type}`
  );
}

function WidgetTaggerNoOptions(props: WidgetProps) {
  const { pointer, isRequired, field } = props;

  const [inputValue, setInputValue] = useState('');

  const [{ value }, , { setValue }] = useField(pointer);
  const selectedValues = Array.isArray(value) ? value.map(createOption) : [];

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (!value.includes(inputValue)) {
          setValue([...value, inputValue]);
        }
        setInputValue('');
        event.preventDefault();
    }
  };

  return (
    <FormControl isRequired={isRequired}>
      {field.label && (
        <FormLabel>
          <FieldLabel size='xs'>{field.label}</FieldLabel>
        </FormLabel>
      )}

      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={(newValue) => {
          setValue(newValue.map((option) => option.value));
        }}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        placeholder={
          <React.Fragment>
            Type & <Kbd>enter</Kbd> to add options
          </React.Fragment>
        }
        value={selectedValues}
      />
    </FormControl>
  );
}

function WidgetTaggerWithOptions(props: WidgetProps & { isMulti?: boolean }) {
  const { pointer, isRequired, isMulti, field } = props;

  const [inputValue, setInputValue] = useState('');

  const [{ value }, , { setValue }] = useField(pointer);
  const selectedValues = value
    ? isMulti
      ? value.map(createOption)
      : createOption(value)
    : isMulti
      ? []
      : undefined;

  const options = useMemo(() => {
    const enums = isMulti
      ? (field as SchemaFieldArray<SchemaFieldString>).items.enum
      : (field as SchemaFieldString).enum;

    return enums!.map<Option>(([value, label]) => ({
      value,
      label
    }));
  }, [field]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (value.includes(inputValue)) {
          setInputValue('');
          event.preventDefault();
        }
    }
  };

  return (
    <FormControl isRequired={isRequired}>
      {field.label && (
        <FormLabel>
          <FieldLabel size='xs'>{field.label}</FieldLabel>
        </FormLabel>
      )}

      <CreatableSelect
        inputValue={inputValue}
        isClearable
        isMulti={isMulti}
        onChange={(newValue) => {
          if (isMulti) {
            setValue(
              ((newValue as Option[]) || []).map((option) => option.value)
            );
          } else {
            setValue(newValue?.value);
          }
        }}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        options={options}
        placeholder='Select or type to add'
        value={selectedValues}
      />
    </FormControl>
  );
}
