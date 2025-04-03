import { getArrayLabel } from './index';
import { SchemaField } from '@stac-manager/data-core';

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
