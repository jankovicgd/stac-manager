import React, { useMemo, useState } from 'react';
import {
  PluginBox,
  useCollectionPlugins,
  WidgetRenderer
} from '@stac-manager/data-core';
import {
  Box,
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react';
import { Formik, FormikHelpers } from 'formik';
import { WidgetJSON } from '@stac-manager/data-widgets';

type FormView = 'fields' | 'json';

export function EditForm(props: {
  initialData?: any;
  onSubmit: (data: any, formikHelpers: FormikHelpers<any>) => void;
}) {
  const { initialData, onSubmit } = props;
  const [stacData, setStacData] = useState(initialData || {});

  const { plugins, formData, toOutData, isLoading } =
    useCollectionPlugins(stacData);

  const [view, setView] = useState<FormView>('fields');

  const editorData = useMemo(
    () => (view === 'json' ? { jsonData: stacData } : formData),
    [view, formData]
  );

  return (
    <Box>
      {isLoading ? (
        <Box>Loading plugins...</Box>
      ) : (
        <Flex direction='column' gap={4}>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize
            initialValues={editorData}
            onSubmit={(values, actions) => {
              const exitData =
                view === 'json' ? values.jsonData : toOutData(values);
              return onSubmit(exitData, actions);
            }}
          >
            {({ handleSubmit, values, isSubmitting }) => (
              <Flex
                as='form'
                direction='column'
                gap={4}
                // @ts-expect-error Can't detect the as=form and throws error
                onSubmit={handleSubmit}
              >
                <Flex
                  gap={4}
                  p={4}
                  borderRadius='lg'
                  bg='base.50'
                  justifyContent='space-between'
                  position='sticky'
                  top={0}
                  zIndex={100}
                  boxShadow='md'
                >
                  <Box>
                    <Text fontSize='sm'>
                      {initialData && 'Edit '}Collection
                    </Text>
                    <Heading>
                      {initialData
                        ? initialData.title || 'Untitled'
                        : 'New Collection'}
                    </Heading>
                  </Box>
                  <Button
                    type='submit'
                    isDisabled={isSubmitting}
                    colorScheme='primary'
                    size='md'
                    alignSelf='flex-end'
                    flexShrink={0}
                  >
                    {initialData ? 'Save' : 'Create'}
                  </Button>
                </Flex>
                <Tabs
                  isLazy
                  variant='enclosed'
                  index={view === 'fields' ? 0 : 1}
                  onChange={(i) => {
                    setView(['fields', 'json'][i] as FormView);
                    setStacData(
                      view === 'json' ? values.jsonData : toOutData(values)
                    );
                  }}
                >
                  <TabList>
                    <Tab bg='base.50a'>FORM</Tab>
                    <Tab>JSON</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0} display='flex' flexFlow='column' gap={4}>
                      {view === 'fields' &&
                        plugins.map((pl) => (
                          <PluginBox key={pl.name} plugin={pl}>
                            {({ field }) => (
                              <Box
                                p='16'
                                borderRadius='lg'
                                bg='base.50a'
                                display='flex'
                                flexDir='column'
                                gap={8}
                              >
                                <Heading size='sm'>{pl.name}</Heading>
                                <WidgetRenderer pointer='' field={field} />
                              </Box>
                            )}
                          </PluginBox>
                        ))}
                    </TabPanel>
                    <TabPanel p={0} pt={4}>
                      {view === 'json' && (
                        <WidgetJSON
                          field={{ type: 'json', label: 'Json Document' }}
                          pointer='jsonData'
                        />
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Flex>
            )}
          </Formik>
        </Flex>
      )}
    </Box>
  );
}
