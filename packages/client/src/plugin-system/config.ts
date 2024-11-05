import { extendPluginConfig } from '@stac-manager/data-core';
import { defaultPluginWidgetConfig } from '@stac-manager/data-widgets';
import { PluginMeta, PluginTest } from '@stac-manager/data-plugins';

export const config = extendPluginConfig(defaultPluginWidgetConfig, {
  // collectionPlugins: [new PluginMeta()],
  collectionPlugins: [new PluginTest()],
  itemPlugins: [],

  'ui:widget': {}
});
