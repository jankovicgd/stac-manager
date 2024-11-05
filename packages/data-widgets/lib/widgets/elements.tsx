import React from 'react';
import { Box, Flex, forwardRef, Heading, IconButton } from '@chakra-ui/react';
import { CollecticonTrashBin } from '@devseed-ui/collecticons-chakra';

export const Fieldset = forwardRef((props, ref) => {
  return (
    <Box
      as='fieldset'
      display='flex'
      flexDirection='column'
      gap={8}
      p={4}
      bg='base.50a'
      borderRadius='md'
      ref={ref}
      {...props}
    />
  );
});

export const FieldsetHeader = forwardRef((props, ref) => {
  return <Flex justifyContent='space-between' gap={4} ref={ref} {...props} />;
});

export const FieldsetBody = forwardRef((props, ref) => {
  return <Flex flexDirection='column' ref={ref} {...props} />;
});

export const FieldsetFooter = forwardRef((props, ref) => {
  return <Flex gap={4} ref={ref} {...props} />;
});

export const FieldsetLabel = forwardRef((props, ref) => {
  return (
    <Heading
      as='p'
      size='sm'
      display='flex'
      alignItems='center'
      gap={2}
      ref={ref}
      {...props}
      sx={{
        ...(props?.sx ?? {}),
        small: {
          borderRadius: 'sm',
          bg: 'base.400a',
          color: 'surface.500',
          px: '0.5rem',
          fontSize: 'xs'
        }
      }}
    />
  );
});

export const FieldsetDeleteBtn = forwardRef((props, ref) => {
  return (
    <IconButton
      colorScheme='base'
      aria-label='Delete item'
      variant='soft-outline'
      size='sm'
      icon={<CollecticonTrashBin />}
      ref={ref}
      {...props}
    />
  );
});
