import {
  inferFieldType,
  getFieldSchema,
  replaceObjectKeyAt
} from './object-property';

describe('Utility Functions', () => {
  describe('inferFieldType', () => {
    it('infers "number" for numeric values', () => {
      expect(inferFieldType(42)).toBe('number');
    });

    it('infers "string[]" for arrays of strings', () => {
      expect(inferFieldType(['a', 'b', 'c'])).toBe('string[]');
    });

    it('infers "number[]" for arrays of numbers', () => {
      expect(inferFieldType([1, 2, 3])).toBe('number[]');
    });

    it('infers "json" for arrays with mixed types', () => {
      expect(inferFieldType([1, 'a', true])).toBe('json');
    });

    it('infers "json" for objects', () => {
      expect(inferFieldType({ key: 'value' })).toBe('json');
    });

    it('infers "string" for other types', () => {
      expect(inferFieldType('hello')).toBe('string');
    });
  });

  describe('getFieldSchema', () => {
    it('returns schema for "string"', () => {
      expect(getFieldSchema('string')).toEqual({
        type: 'string',
        label: 'Value'
      });
    });

    it('returns schema for "number"', () => {
      expect(getFieldSchema('number')).toEqual({
        type: 'number',
        label: 'Value'
      });
    });

    it('returns schema for "string[]"', () => {
      expect(getFieldSchema('string[]')).toEqual({
        type: 'array',
        label: 'Value',
        minItems: 1,
        items: { type: 'string' }
      });
    });

    it('returns schema for "number[]"', () => {
      expect(getFieldSchema('number[]')).toEqual({
        type: 'array',
        label: 'Value',
        minItems: 1,
        items: { type: 'number' }
      });
    });

    it('returns schema for "json"', () => {
      expect(getFieldSchema('json')).toEqual({ type: 'json', label: 'Value' });
    });

    it('returns null for unknown types', () => {
      expect(getFieldSchema('unknown' as any)).toBeNull();
    });
  });

  describe('replaceObjectKeyAt', () => {
    it('replaces a key at the root level', () => {
      const obj = { oldKey: 'value' };
      const result = replaceObjectKeyAt(obj, 'oldKey', 'newKey');
      expect(result).toEqual({ newKey: 'value' });
    });

    it('replaces a key at a nested path', () => {
      const obj = { nested: { oldKey: 'value' } };
      const result = replaceObjectKeyAt(obj, 'nested.oldKey', 'newKey');
      expect(result).toEqual({ nested: { newKey: 'value' } });
    });

    it('preserves other keys in the object', () => {
      const obj = { oldKey: 'value', anotherKey: 'anotherValue' };
      const result = replaceObjectKeyAt(obj, 'oldKey', 'newKey');
      expect(result).toEqual({ newKey: 'value', anotherKey: 'anotherValue' });
    });

    it('does not mutate the original object', () => {
      const obj = { oldKey: 'value' };
      const result = replaceObjectKeyAt(obj, 'oldKey', 'newKey');
      expect(obj).toEqual({ oldKey: 'value' });
      expect(result).not.toBe(obj);
    });
  });
});
