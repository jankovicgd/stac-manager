import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Image,
  Text,
  Heading,
  Box,
  IconButton,
  HStack,
  Tag,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Link
} from '@chakra-ui/react';
import { CollecticonEllipsisVertical } from '@devseed-ui/collecticons-chakra';

export default function ItemCard() {
  return (
    <Card as='article' variant='filled'>
      <Link href='#'>
        <Image
          src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
          alt='Green double couch with wooden legs'
          borderRadius='md'
        />
      </Link>
      <CardHeader as='header'>
        <Flex direction='row' gap={4}>
          <Box flexBasis='100%'>
            <Heading size='sm' as='h3'>
              <Link href='#' color='inherit'>
                Card title
              </Link>
            </Heading>
            <Text as='p' fontSize='sm' color='base.400'>
              Card subtitle
            </Text>
          </Box>
          <Box>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<CollecticonEllipsisVertical />}
                variant='outline'
                size='sm'
              />
              <MenuList>
                <MenuItem>Edit</MenuItem>
                <MenuItem>Delete</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </CardHeader>
      <CardBody>
        <Text size='md'>
          Card Summary. Lorem ipsum dolor sit, amet consectetur adipisicing
          elit. Non impedit vitae tempore repellat neque sunt aut, veniam
          facere, corporis nihil voluptas quis quia magni.
        </Text>
      </CardBody>
      <CardFooter as='footer'>
        <HStack spacing={4}>
          <Tag size='sm' colorScheme='primary' as='a' href='#'>
            Tag
          </Tag>
          <Tag size='sm' colorScheme='primary' as='a' href='#'>
            Tag
          </Tag>
          <Tag size='sm' colorScheme='primary' as='a' href='#'>
            Tag
          </Tag>
          <Tag size='sm' colorScheme='primary' as='a' href='#'>
            Tag
          </Tag>
        </HStack>
      </CardFooter>
    </Card>
  );
}
