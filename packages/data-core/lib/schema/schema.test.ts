import { schemaToFormDataStructure } from './index';
import { SchemaField } from './types';

describe('schemaToFormDataStructure', () => {
  it('should handle root/object type fields', () => {
    const schema: SchemaField = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'string' }
      }
    };
    const result = schemaToFormDataStructure(schema);
    expect(result).toEqual({ name: '', age: '' });
  });

  it('should handle array type fields with minItems', () => {
    const schema: SchemaField = {
      type: 'array',
      minItems: 2,
      items: { type: 'string' }
    };
    const result = schemaToFormDataStructure(schema);
    expect(result).toEqual(['', '']);
  });

  it('should handle array type fields without minItems', () => {
    const schema: SchemaField = {
      type: 'array',
      items: { type: 'string' }
    };
    const result = schemaToFormDataStructure(schema);
    expect(result).toEqual([]);
  });

  it('should handle json type fields', () => {
    const schema: SchemaField = {
      type: 'json'
    };
    const result = schemaToFormDataStructure(schema);
    expect(result).toEqual({});
  });

  it('should handle default case for unsupported types', () => {
    const schema: SchemaField = {
      type: 'string'
    };
    const result = schemaToFormDataStructure(schema);
    expect(result).toEqual('');
  });

  it('should handle deeply nested schemas', () => {
    const schema: SchemaField = {
      type: 'root',
      properties: {
        users: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              age: { type: 'string' },
              accounts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    accountName: { type: 'string' },
                    balance: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    };
    const result = schemaToFormDataStructure(schema);
    expect(result).toEqual({
      users: [
        {
          name: '',
          age: '',
          accounts: []
        }
      ]
    });
  });
});
