import { extendPluginConfig } from '@stac-manager/data-core';
import { defaultPluginWidgetConfig } from '@stac-manager/data-widgets';
import { PluginCore, PluginTest } from '@stac-manager/data-plugins';

export const config = extendPluginConfig(defaultPluginWidgetConfig, {
  collectionPlugins: [new PluginCore()],
  // collectionPlugins: [new PluginTest()],
  itemPlugins: [],

  'ui:widget': {}
});
