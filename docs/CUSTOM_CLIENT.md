# STAC-Manager 📡 📄 — Custom app

- [STAC-Manager 📡 📄 — Custom app](#stac-manager----custom-app)
  - [Provider](#provider)
  - [Config](#config)
  - [From](#from)

If you're not using the STAC-Manager client app and want to build your own app using the plugin system, the following guide will help you set up the plugin system in your project.

## Provider

Wrap the `PluginConfigProvider` around the `App` component to provide the plugins with the configuration.

```tsx
import { PluginConfigProvider } from '@stac-manager/data-core';

  <PluginConfigProvider config={config}>
      <App />
  </PluginConfigProvider>
```

## Config

The config object should contain a list of plugins to use for the collections and items, as well as the widget configuration (which widgets to use for which field types).

```js
{
  collectionPlugins: [
    new PluginOne(),
    new PluginTwo(),
    ],
  itemPlugins: [
    new PluginTwoB(),
  ],

  'ui:widget': {
    'customWidget': CustomWidgetComponent,
  }
}
```

It is possible to extend the default widget configuration with the `extendPluginConfig` function. The default configuration already defines the widgets for the basic field types.

```ts
import { extendPluginConfig } from '@stac-manager/data-core';
import { defaultPluginWidgetConfig } from '@stac-manager/data-widgets';

export const config = extendPluginConfig(defaultPluginWidgetConfig, {
  collectionPlugins: [],
  itemPlugins: [],

  'ui:widget': {}
});
```

## From

The plugin system is responsible for dynamically generating forms based on a schema definition and uses [Formik](https://formik.org/) to handle the form state. Wrapping the plugins with a formik form is responsibility of the app, not the plugin system.

Below there's a minimal example of all that's needed to use the plugin system.
```tsx
import React from 'react';
import {
  PluginBox,
  useCollectionPlugins,
  validatePluginsFieldsData,
  WidgetRenderer
} from '@stac-manager/data-core';
import { Formik } from 'formik';

export function EditForm() {
  // Change this to the initial data of the form. Could come from an API if
  // editing an existing form.
  const initialData = {};

  // The useCollectionPlugins takes the initial data and initializes all the
  // plugins by calling their init method. Which plugins are used is defined in
  // the config file passed to the PluginConfigProvider.
  // Once that's done prepares the form data by calling enterData on each plugin
  // and prepares the toOutData function that will be used to convert the form
  // data back to the original data structure by calling each plugin's exitData
  // method.
  // All this process is asynchronous and the isLoading flag will be true until
  // all everything are ready.
  // NOTE: If items are being edited, useItemPlugins would be used instead.
  const { plugins, formData, toOutData, isLoading } =
    useCollectionPlugins(initialData);

  return (
    <div>
      {isLoading ? (
        <p>Loading plugins...</p>
      ) : (
        // STAC-Manager uses Formik for form handling, therefore the form
        // must be wrapped in a Formik component.
        <Formik
          validateOnChange={false}
          enableReinitialize
          initialValues={formData}
          onSubmit={(values, actions) => {
            // Once the form is submitted, the toOutData function must be called
            // to convert the form data back to the original data structure.
            const exitData = toOutData(values);
          }}
          validate={(values) => {
            // validatePluginsFieldsData is a helper function that validates the
            // form data against the plugins schema.
            const [, error] = validatePluginsFieldsData(plugins, values);
            if (error) return error;
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              {plugins.map((plugin) => (
                // Each plugin is wrapped in a headless PluginBox component that
                // does some plugin validation and provides each plugin with a
                // PluginProvider context which enables access to the plugin's
                // info through usePlugin hook.
                <PluginBox key={plugin.name} plugin={plugin}>
                  {({ field }) => (
                    <div>
                      <h2>{plugin.name}</h2>
                      {
                        // The WidgetRenderer component is used to render the
                        // plugin's fields. It will render the correct widget
                        // based on the field type provided in the field prop.
                        // Since this is the root object, the pointer prop is
                        // an empty string.
                      }
                      <WidgetRenderer pointer='' field={field} />
                    </div>
                  )}
                </PluginBox>
              ))}
            </form>
          )}
        </Formik>
      )}
    </div>
  );
}
```