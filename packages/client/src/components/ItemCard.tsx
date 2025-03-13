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
  HStack,
  Tag,
  Skeleton,
  SkeletonText
} from '@chakra-ui/react';
import SmartLink from './SmartLink';

interface ItemCardProps {
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  to?: string;
  renderMenu?: () => React.ReactNode;
}

export function ItemCard({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  description,
  tags,
  to,
  renderMenu
}: ItemCardProps) {
  const renderLink = (children: React.ReactNode) => {
    return to ? (
      <SmartLink to={to} color='inherit'>
        {children}
      </SmartLink>
    ) : (
      <>{children}</>
    );
  };

  return (
    <Card as='article' variant='filled'>
      {imageSrc &&
        renderLink(
          <Image
            src={imageSrc}
            alt={imageAlt}
            height='16rem'
            width='100%'
            objectFit='cover'
            borderRadius='md'
          />
        )}
      <CardHeader as='header'>
        <Flex direction='row' gap={4}>
          {(title || subtitle) && (
            <Box flexBasis='100%'>
              {title && (
                <Heading size='sm' as='h3' wordBreak='break-word'>
                  {renderLink(title)}
                </Heading>
              )}
              {subtitle && (
                <Text as='p' fontSize='sm' color='base.400'>
                  {subtitle}
                </Text>
              )}
            </Box>
          )}
          {renderMenu && <Box>{renderMenu()}</Box>}
        </Flex>
      </CardHeader>
      {description && (
        <CardBody>
          <Text size='md'>{description}</Text>
        </CardBody>
      )}
      {tags && tags.length > 0 && (
        <CardFooter as='footer'>
          <HStack spacing={2} wrap='wrap'>
            {tags.map((tag) => (
              // <Tag key={tag} size='sm' colorScheme='primary' as='a' href='#'>
              <Tag key={tag} size='sm' colorScheme='primary'>
                {tag}
              </Tag>
            ))}
          </HStack>
        </CardFooter>
      )}
    </Card>
  );
}

export function ItemCardLoading(props: { mini?: boolean }) {
  return (
    <Card as='article' variant='filled' p={8}>
      <Flex direction='column' gap={2}>
        <Skeleton h={6} width='40%' />
        <Skeleton h={4} width='30%' />
      </Flex>

      {!props.mini && (
        <>
          <SkeletonText mt={8} noOfLines={4} spacing='4' skeletonHeight='2' />
          <Flex gap={2} mt={12}>
            <Skeleton h={4} width={12} />
            <Skeleton h={4} width={12} />
            <Skeleton h={4} width={12} />
          </Flex>
        </>
      )}
    </Card>
  );
}
