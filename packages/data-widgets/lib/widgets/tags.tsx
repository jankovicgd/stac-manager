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

export function WidgetTags(props: WidgetProps) {
  const { field } = props;

  if (field.type !== 'array') {
    throw new Error('WidgetTags only supports array fields');
  }

  if (field.items.type === 'string' && field.items.enum) {
    return <WidgetTagsWithOptions {...props} />;
  }

  return <WidgetTagsNoOptions {...props} />;
}

function WidgetTagsNoOptions(props: WidgetProps) {
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

function WidgetTagsWithOptions(props: WidgetProps) {
  const { pointer, isRequired } = props;
  const field = props.field as SchemaFieldArray<SchemaFieldString>;

  const [inputValue, setInputValue] = useState('');

  const [{ value }, , { setValue }] = useField(pointer);
  const selectedValues = Array.isArray(value) ? value.map(createOption) : [];

  const options = useMemo(() => {
    return field.items.enum!.map<Option>(([value, label]) => ({
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
        isMulti
        onChange={(newValue) => {
          setValue(newValue.map((option) => option.value));
        }}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        options={options}
        placeholder='Select or type to add options'
        value={selectedValues}
      />
    </FormControl>
  );
}
