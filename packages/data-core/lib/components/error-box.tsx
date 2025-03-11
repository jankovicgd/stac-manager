import React from 'react';
import { Flex, FlexProps, forwardRef } from '@chakra-ui/react';

export const ErrorBox = forwardRef<FlexProps, typeof Flex>((props, ref) => (
  <Flex
    ref={ref}
    maxW='container.md'
    alignItems='center'
    direction='column'
    gap={4}
    py={16}
    px={8}
    color='red.500'
    borderRadius='md'
    borderWidth={1}
    borderStyle='dashed'
    borderColor='red.500'
    {...props}
  />
));
