import { Plugin, SchemaFieldObject } from '@stac-manager/data-core';

export class PluginTest extends Plugin {
  name = 'FieldsTest';

  editSchema(): SchemaFieldObject {
    return {
      type: 'root',
      properties: {
        arr_strings: {
          label: 'Array of Strings',
          type: 'array',
          items: {
            label: 'String',
            type: 'string'
          }
        },
        arrObj: {
          label: 'Array of Objects (with limits)',
          type: 'array',
          minItems: 1,
          maxItems: 3,
          items: {
            type: 'object',
            properties: {
              name: {
                label: 'Name',
                type: 'string'
              },
              nick: {
                label: 'Nickname',
                type: 'string'
              }
            }
          }
        },
        spatial: {
          label: 'Spatial Extent',
          type: 'array',
          minItems: 1,
          items: {
            type: 'array',
            label: 'Extent',
            minItems: 4,
            maxItems: 4,
            items: {
              label: [
                'Min Longitude',
                'Min Latitude',
                'Max Longitude',
                'Max Latitude'
              ],
              type: 'string'
            }
          }
        },
        checkbox: {
          label: 'Select multiple strings',
          type: 'array',
          items: {
            type: 'string',
            enum: [
              ['viridis', 'viridis'],
              ['plasma', 'plasma'],
              ['inferno', 'inferno']
            ]
          }
        },
        radio: {
          label: 'Select one string radio (default)',
          type: 'string',
          enum: [
            ['viridis', 'viridis'],
            ['plasma', 'plasma'],
            ['inferno', 'inferno']
          ]
        },
        select: {
          label: 'Select one string',
          type: 'string',
          'ui:widget': 'select',
          enum: [
            ['viridis', 'viridis'],
            ['plasma', 'plasma'],
            ['inferno', 'inferno']
          ]
        },
        arrayCheckboxes: {
          label: 'Array of Checkboxes',
          type: 'array',
          items: {
            label: 'Group',
            type: 'array',
            items: {
              label: 'Checkbox option',
              type: 'string',
              enum: [
                ['viridis', 'viridis'],
                ['plasma', 'plasma'],
                ['inferno', 'inferno']
              ]
            }
          }
        }
      }
    };
  }

  enterData({ arr, extent, ...rest }: any = {}) {
    return {
      ...rest,
      arrObj: arr,
      spatial: extent?.spatial
    };
  }

  exitData({ arrObj, spatial, ...rest }: any = {}) {
    return {
      arr: arrObj,
      extent: {
        spatial: spatial?.map((inner: string[]) => inner.map((v: string) => v))
      },
      ...rest
    };
  }
}
