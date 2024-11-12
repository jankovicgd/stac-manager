import React, { useMemo, useState } from 'react';
import {
  Plugin,
  PluginBox,
  useCollectionPlugins,
  WidgetRenderer
} from '@stac-manager/data-core';
import { Box, Button, Flex, Heading, Textarea } from '@chakra-ui/react';
import useUpdateCollection from './useUpdateCollection';
import { Field, FieldProps, Formik } from 'formik';

interface CollectionFormProps {}

type FormView = 'fields' | 'json';
type FormAction = 'submit' | 'switch-view';

export function CollectionForm(props: CollectionFormProps) {
  const [stacData, setStacData] = useState({});

  const { plugins, formData, toOutData, isLoading } =
    useCollectionPlugins(stacData);

  const [view, setView] = useState<FormView>('fields');

  const onAction: EditFormProps['onAction'] = (action, { view, data }) => {
    console.log(action, view, data);
    if (action === 'submit') {
      const exitData =
        view === 'json' ? JSON.parse(data.jsonData) : toOutData(data);
      console.log('🚀 ~ onSubmit ~ exitData:', exitData);
    } else if (action === 'switch-view') {
      if (view === 'json') {
        console.log('JSON.parse(data.jsonData)', JSON.parse(data.jsonData));
        setStacData(JSON.parse(data.jsonData));
        setView('fields');
      } else {
        const d = toOutData(data);
        console.log('d', d);
        setStacData(d);
        setView('json');
      }
    }
  };

  const editorData = useMemo(
    () =>
      view === 'json'
        ? { jsonData: JSON.stringify(stacData, null, 2) }
        : formData,
    [view, formData]
  );

  console.log('🚀 ~ CollectionForm ~ editorData:', editorData);
  return (
    <Box>
      {isLoading ? (
        <Box>Loading plugins...</Box>
      ) : (
        <EditForm
          data={editorData}
          plugins={plugins}
          onAction={onAction}
          view={view}
        />
      )}
    </Box>
  );
}

interface EditFormProps {
  data: Record<string, any>;
  plugins: Plugin[];
  onAction: (
    action: FormAction,
    { view, data }: { view: FormView; data: any }
  ) => void;
  view: FormView;
}

export function EditForm({ plugins, data, onAction, view }: EditFormProps) {
  return (
    <Flex direction='column' gap={4}>
      <Formik
        validateOnChange={false}
        enableReinitialize
        initialValues={data}
        onSubmit={(values /*, actions*/) => {
          onAction('submit', {
            view,
            data: values
          });
        }}
      >
        {(props) => (
          <Flex
            as='form'
            direction='column'
            gap={4}
            // @ts-expect-error Can't detect the as=form and throws error
            onSubmit={props.handleSubmit}
          >
            <input type='submit' />
            <Button
              onClick={() => {
                onAction('switch-view', {
                  view,
                  data: props.values
                });
              }}
            >
              {view}
            </Button>
            {view === 'json' ? (
              <Field name='jsonData'>
                {(props: FieldProps) => (
                  <Textarea {...props.field} minH='20rem' />
                )}
              </Field>
            ) : (
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
              ))
            )}
          </Flex>
        )}
      </Formik>
    </Flex>
  );
}
