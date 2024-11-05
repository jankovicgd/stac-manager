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
        radio: {
          label: 'Select one string radio (default)',
          type: 'string',
          enum: [
            ['viridis', 'viridis'],
            ['plasma', 'plasma'],
            ['inferno', 'inferno']
          ]
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
        arrNested: {
          type: 'array',
          label: 'Array no limit',
          items: {
            type: 'array',
            label: 'Array with limits',
            minItems: 1,
            maxItems: 2,
            items: {
              type: 'array',
              label: 'Array fixed',
              minItems: 2,
              maxItems: 2,
              items: {
                label: ['Label', 'Value'],
                type: 'string'
              }
            }
          }
        },
        arrayRadios: {
          label: 'Array of Radios',
          type: 'array',
          items: {
            label: 'Radios options',
            type: 'string',
            'ui:widget': 'select',
            enum: [
              ['viridis', 'viridis'],
              ['plasma', 'plasma'],
              ['inferno', 'inferno']
            ]
          }
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

  // enterData(data: any = {}) {
  enterData() {
    return {};
  }

  // exitData(data: any) {
  exitData() {
    return {};
  }
}
