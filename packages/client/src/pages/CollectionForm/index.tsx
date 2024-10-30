import React from 'react';
import {
  Plugin,
  PluginBox,
  useCollectionPlugins,
  WidgetRenderer
} from '@stac-manager/data-core';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { FormProvider, useForm} from 'react-hook-form';
import useUpdateCollection from './useUpdateCollection';

interface CollectionFormProps {}

export function CollectionForm(props: CollectionFormProps) {
  const { plugins, formData, toOutData, isLoading } =
    useCollectionPlugins(undefined);
    const { update, state: updateState } = useUpdateCollection();

  const onSubmit = (newData) => {
    const exitData = toOutData(newData);
    console.log('🚀 ~ onSubmit ~ exitData:', exitData);
    update(exitData);
  };

  return (
    <Box>
      {isLoading ? (
        <Box>Loading plugins...</Box>
      ) : (
        <EditForm data={formData} plugins={plugins} onSubmit={onSubmit} />
      )}
    </Box>
  );
}

interface EditFormProps {
  data: Record<string, any>;
  plugins: Plugin[];
  onSubmit: (data: Record<string, any>) => void;
}

export function EditForm({ plugins, data, onSubmit }: EditFormProps) {
  const methods = useForm({
    defaultValues: data
  });
  // console.log(methods.formState.isDirty); // make sure formState is read before render to enable the Proxy

  return (
    <FormProvider {...methods}>
      <Flex
        as='form'
        direction='column'
        gap={4}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {plugins.map((pl, index) => (
          <PluginBox key={index} plugin={pl}>
            {({ field }) => (
              <Box p='4' border='1px dashed grey'>
                <Heading size='sm'>{pl.name}</Heading>
                <WidgetRenderer pointer='' field={field} />
              </Box>
            )}
          </PluginBox>
        ))}
        <input type='submit' />
      </Flex>
    </FormProvider>
  );
}
