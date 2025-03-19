import { Plugin, PluginEditSchema } from '@stac-manager/data-core';
import {
  addStacExtensionOption,
  array2Object,
  hasStacExtension,
  object2Array
} from '../utils';

export class PluginItemAssets extends Plugin {
  name = 'Item Assets Extension';

  constructor() {
    super();

    addStacExtensionOption(
      this,
      'Item Assets Definition',
      'https://stac-extensions.github.io/item-assets/v1.0.0/schema.json'
    );
  }

  editSchema(data: any): PluginEditSchema {
    if (!hasStacExtension(data, 'item-assets')) {
      return Plugin.HIDDEN;
    }

    return {
      type: 'root',
      properties: {
        item_assets: {
          type: 'array',
          label: 'Item Assets',
          minItems: 1,
          items: {
            type: 'object',
            required: ['id'],
            properties: {
              id: {
                label: 'Item Asset ID',
                type: 'string'
              },
              type: {
                label: 'Type',
                type: 'string'
              },
              title: {
                label: 'Title',
                type: 'string'
              },
              description: {
                label: 'Description',
                type: 'string'
              },
              roles: {
                label: 'Roles',
                type: 'array',
                'ui:widget': 'tagger',
                items: {
                  label: 'Role',
                  type: 'string',
                  enum: [
                    ['thumbnail', 'Thumbnail'],
                    ['overview', 'Overview'],
                    ['data', 'Data'],
                    ['metadata', 'Metadata']
                  ]
                }
              }
            }
          }
        }
      }
    };
  }

  enterData(data: any = {}) {
    return {
      item_assets: object2Array(data.item_assets, 'id')
    };
  }

  exitData(data: any) {
    return {
      item_assets: array2Object(data.item_assets, 'id')
    };
  }
}
