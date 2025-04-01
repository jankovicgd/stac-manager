import { mod, getArrayLabel, toNumber, castArray } from './index';
import { SchemaField } from '@stac-manager/data-core';

describe('mod', () => {
  it('should return the correct positive remainder', () => {
    expect(mod(5, 3)).toBe(2);
  });

  it('should handle negative dividends correctly', () => {
    expect(mod(-1, 3)).toBe(2);
  });

  it('should handle zero divisor correctly', () => {
    expect(mod(0, 3)).toBe(0);
  });
});

describe('getArrayLabel', () => {
  it('should return a label with a number suffix for string labels', () => {
    const field: SchemaField = { label: 'Label' } as any;
    const result = getArrayLabel(field, 9);

    expect(result).toEqual({
      label: 'Label',
      num: 10, // 1-based index
      formatted: expect.anything()
    });
    expect(result?.formatted).toMatchSnapshot();
  });

  it('should cycle through array labels based on index', () => {
    const field: SchemaField = { label: ['One', 'Two', 'Three'] } as any;
    expect(getArrayLabel(field, 0)?.label).toBe('One');
    expect(getArrayLabel(field, 3)?.label).toBe('One');
    expect(getArrayLabel(field, 4)?.label).toBe('Two');
  });

  it('should return null if label is null', () => {
    const field: SchemaField = { label: null } as any;
    expect(getArrayLabel(field, 0)).toBeNull();
  });

  it('should return Item if label is undefined', () => {
    const field: SchemaField = { label: undefined } as any;
    const result = getArrayLabel(field, 0);

    expect(result).toEqual({
      label: 'Item',
      num: 1,
      formatted: expect.anything()
    });
    expect(result?.formatted).toMatchSnapshot();
  });
});

describe('toNumber', () => {
  it('should convert valid numbers correctly', () => {
    expect(toNumber('42')).toBe(42);
    expect(toNumber(42)).toBe(42);
  });

  it('should return null for invalid numbers', () => {
    expect(toNumber('abc')).toBeNull();
    expect(toNumber(undefined)).toBeNull();
  });
});

describe('castArray', () => {
  it('should wrap non-array values in an array', () => {
    expect(castArray(42)).toEqual([42]);
    expect(castArray('test')).toEqual(['test']);
  });

  it('should return the same array if input is already an array', () => {
    expect(castArray([42])).toEqual([42]);
    expect(castArray(['test'])).toEqual(['test']);
  });
});
