import React, { useEffect, useState, useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  IconButton,
  forwardRef,
  InputProps,
  SelectProps,
  Select,
  FormHelperText
} from '@chakra-ui/react';

const FIELD_MARGIN = '4';

type ArrayFieldProps = Omit<InputProps, 'onChange' | 'value'> & {
  label?: string;
  helper?: string;
  onChange: (values: string[]) => void;
  value?: (string | number)[];
};

export const ArrayInput = forwardRef<ArrayFieldProps, typeof Input>(
  (props, ref) => {
    const { value, onChange, label, helper, ...rest } = props;
    const [val, setVal] = useState(value?.join(',') || '');

    useEffect(() => setVal(value?.join(',') || ''), [value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
      event
    ) => {
      const { value } = event.target;
      setVal(value);

      if (value.length === 0) {
        onChange([]);
      } else {
        onChange(event.target.value?.split(',').map((val) => val.trim()));
      }
    };

    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Input {...rest} value={val} onChange={handleChange} ref={ref} />
        <FormHelperText>{helper}</FormHelperText>
      </FormControl>
    );
  }
);

interface SelectFieldProps extends SelectProps {
  label?: string;
}

export const SelectInput = forwardRef<SelectFieldProps, typeof Select>(
  (props, ref) => {
    const { label, ...rest } = props;
    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Select {...rest} ref={ref} />
      </FormControl>
    );
  }
);

type DateRangeInputProps = {
  label: string;
  error?: {
    message: string;
  };
  dateRangeFrom?: string;
  setDateRangeFrom: (date: string) => void;
  dateRangeTo?: string;
  setDateRangeTo: (date: string) => void;
};

export function DateRangeInput({
  label,
  error,
  dateRangeFrom,
  setDateRangeFrom,
  dateRangeTo,
  setDateRangeTo
}: DateRangeInputProps) {
  const handleRangeFromChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => setDateRangeFrom(e.target.value), [setDateRangeFrom]);
  const handleRangeToChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => setDateRangeTo(e.target.value), [setDateRangeTo]);

  return (
    <FormControl
      isInvalid={!!error}
      my={FIELD_MARGIN}
      as='fieldset'
      display='flex'
      gap={FIELD_MARGIN}
    >
      <Box as='legend' mb='1'>
        {label}
      </Box>
      <Box>
        <FormControl>
          <FormLabel fontWeight='400'>Date from</FormLabel>
          <Flex>
            <Input
              type='date'
              onChange={handleRangeFromChange}
              value={dateRangeFrom}
            />
            <IconButton
              variant='link'
              aria-label='Clear date-from field'
              icon={<MdDelete />}
              onClick={() => setDateRangeFrom('')}
            />
          </Flex>
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel fontWeight='400'>Date to</FormLabel>
          <Flex>
            <Input
              type='date'
              onChange={handleRangeToChange}
              value={dateRangeTo}
            />
            <IconButton
              variant='link'
              aria-label='Clear date-to field'
              icon={<MdDelete />}
              onClick={() => setDateRangeTo('')}
            />
          </Flex>
        </FormControl>
      </Box>
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
