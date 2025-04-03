import { Plugin } from '@stac-manager/data-core';
import {
  fieldIf,
  emptyString2Null,
  null2EmptyString,
  object2Array,
  object2Tuple,
  array2Object,
  tuple2Object,
  hasStacExtension,
  addStacExtensionOption
} from './utils';

describe('Utils', () => {
  describe('fieldIf', () => {
    it('should return the ifTrue schema when condition is true', () => {
      const result = fieldIf(true, 'test', { type: 'string' });
      expect(result).toEqual({ test: { type: 'string' } });
    });

    it('should return the ifFalse schema when condition is false', () => {
      const result = fieldIf(
        false,
        'test',
        { type: 'string' },
        { type: 'number' }
      );
      expect(result).toEqual({ test: { type: 'number' } });
    });

    it('should return an empty object when condition is false and ifFalse is not provided', () => {
      const result = fieldIf(false, 'test', { type: 'string' });
      expect(result).toEqual({});
    });
  });

  describe('emptyString2Null', () => {
    it('should convert empty strings to null', () => {
      expect(emptyString2Null(['', 'test', ['']])).toEqual([
        null,
        'test',
        [null]
      ]);
    });

    it('should leave non-empty values unchanged', () => {
      expect(emptyString2Null(['test', 123, null])).toEqual([
        'test',
        123,
        null
      ]);
    });
  });

  describe('null2EmptyString', () => {
    it('should convert null values to empty strings', () => {
      expect(null2EmptyString([null, 'test', [null]])).toEqual([
        '',
        'test',
        ['']
      ]);
    });

    it('should leave non-null values unchanged', () => {
      expect(null2EmptyString(['test', 123, ''])).toEqual(['test', 123, '']);
    });
  });

  describe('object2Array', () => {
    it('should convert an object to an array of objects', () => {
      const input = { a: { name: 'Alice' }, b: { name: 'Bob' } };
      const result = object2Array(input, 'id');
      expect(result).toEqual([
        { id: 'a', name: 'Alice' },
        { id: 'b', name: 'Bob' }
      ]);
    });

    it('should apply the transformation function if provided', () => {
      const input = { a: { value: 1 }, b: { value: 2 } };
      const result = object2Array(input, 'id', (v) => ({ value: v.value * 2 }));
      expect(result).toEqual([
        { id: 'a', value: 2 },
        { id: 'b', value: 4 }
      ]);
    });
  });

  describe('object2Tuple', () => {
    it('should convert an object to an array of tuples', () => {
      const input = { a: 1, b: 2 };
      const result = object2Tuple(input);
      expect(result).toEqual([
        ['a', 1],
        ['b', 2]
      ]);
    });
  });

  describe('array2Object', () => {
    it('should convert an array of objects to an object', () => {
      const input = [
        { id: 'a', value: 1 },
        { id: 'b', value: 2 }
      ];
      const result = array2Object(input, 'id');
      expect(result).toEqual({
        a: { value: 1 },
        b: { value: 2 }
      });
    });

    it('should apply the transformation function if provided', () => {
      const input = [
        { id: 'a', value: 1 },
        { id: 'b', value: 2 }
      ];
      const result = array2Object(input, 'id', (v) => ({ value: v.value * 2 }));
      expect(result).toEqual({
        a: { value: 2 },
        b: { value: 4 }
      });
    });
  });

  describe('tuple2Object', () => {
    it('should convert an array of tuples to an object', () => {
      const input = [
        ['a', 1],
        ['b', 2]
      ] as [string, any][];
      const result = tuple2Object(input);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('hasStacExtension', () => {
    it('should return true if the extension exists', () => {
      const data = {
        stac_extensions: [
          'https://stac-extensions.github.io/item-assets/v1.0.0/schema.json'
        ]
      };
      const result = hasStacExtension(data, 'item-assets');
      expect(result).toBe(true);
    });

    it('should return false if the extension does not exist', () => {
      const data = {
        stac_extensions: [
          'https://stac-extensions.github.io/eo/v1.0.0/schema.json'
        ]
      };
      const result = hasStacExtension(data, 'item-assets');
      expect(result).toBe(false);
    });

    it('should return true if the extension exists and version matches', () => {
      const data = {
        stac_extensions: [
          'https://stac-extensions.github.io/item-assets/v1.0.0/schema.json'
        ]
      };
      const result = hasStacExtension(
        data,
        'item-assets',
        (v) => v === '1.0.0'
      );
      expect(result).toBe(true);
    });

    it('should return false if the extension exists but version does not match', () => {
      const data = {
        stac_extensions: [
          'https://stac-extensions.github.io/item-assets/v1.0.0/schema.json'
        ]
      };
      const result = hasStacExtension(
        data,
        'item-assets',
        (v) => v === '2.0.0'
      );
      expect(result).toBe(false);
    });
  });

  describe('addStacExtensionOption', () => {
    it('should add a new STAC extension option to the schema', () => {
      const mockPlugin = {
        registerHook: jest.fn()
      } as unknown as Plugin;

      const label = 'New Extension';
      const value = 'https://example.com/new-extension/v1.0.0/schema.json';

      addStacExtensionOption(mockPlugin, label, value);

      expect(mockPlugin.registerHook).toHaveBeenCalledWith(
        expect.any(String),
        'onAfterEditSchema',
        expect.any(Function)
      );

      // @ts-expect-error mock doesn't exist because ot os cast as Plugin
      const hookCallback = mockPlugin.registerHook.mock.calls[0][2];
      const schema = {
        properties: {
          stac_extensions: {
            items: {
              enum: []
            }
          }
        }
      };

      const result = hookCallback(null, null, schema);

      expect(result.properties.stac_extensions.items.enum).toContainEqual([
        value,
        label
      ]);
    });

    it('should return the schema unchanged if it is invalid', () => {
      const mockPlugin = {
        registerHook: jest.fn()
      } as unknown as Plugin;

      const label = 'New Extension';
      const value = 'https://example.com/new-extension/v1.0.0/schema.json';

      addStacExtensionOption(mockPlugin, label, value);

      // @ts-expect-error mock doesn't exist because ot os cast as Plugin
      const hookCallback = mockPlugin.registerHook.mock.calls[0][2];

      const invalidSchema = null;
      const result = hookCallback(null, null, invalidSchema);

      expect(result).toBeNull();
    });
  });
});
