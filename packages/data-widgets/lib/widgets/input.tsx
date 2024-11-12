import React from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input
} from '@chakra-ui/react';
import { useField } from 'formik';
import { SchemaFieldString, WidgetProps } from '@stac-manager/data-core';
import { CollecticonTrashBin } from '@devseed-ui/collecticons-chakra';

import { FieldLabel } from './elements';

interface WidgetInputProps extends WidgetProps {
  label?: React.ReactNode;
  isDeletable?: boolean;
  type?: string;
  transformValue?: (value: any) => any;
  onDeleteClick?: () => void;
  isDeleteDisabled?: boolean;
}

export function WidgetInput(props: WidgetInputProps) {
  const {
    label,
    isDeletable,
    onDeleteClick,
    isDeleteDisabled,
    pointer,
    isRequired,
    type,
    transformValue = (v) => v
  } = props;
  const field = props.field as SchemaFieldString;

  const [{ onBlur }, meta, { setValue }] = useField<number>(props.pointer);

  const fieldLabel = label || field.label;

  return (
    <FormControl isRequired={isRequired}>
      <Flex gap={4}>
        {fieldLabel && (
          <FormLabel>
            <FieldLabel size='xs'>{fieldLabel}</FieldLabel>
          </FormLabel>
        )}
        <Box ml='auto'>
          {isDeletable && (
            <IconButton
              colorScheme='base'
              variant='soft-outline'
              size='xs'
              onClick={onDeleteClick}
              aria-label='Remove item'
              icon={<CollecticonTrashBin />}
              isDisabled={isDeleteDisabled}
            />
          )}
        </Box>
      </Flex>
      <Input
        type={type}
        size='sm'
        name={pointer}
        bg='surface.500'
        borderColor='base.200'
        borderRadius='md'
        onBlur={onBlur}
        onChange={(e) => setValue(transformValue(e.target.value))}
        isInvalid={meta.touched && meta.error ? true : false}
      />
      {meta.touched && meta.error && (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      )}
    </FormControl>
  );
}
