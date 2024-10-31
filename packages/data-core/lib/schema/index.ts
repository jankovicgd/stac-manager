import { SchemaField, SchemaFieldObject } from './types';

export interface FormDataStructure {
  [key: string]: string | FormDataStructure | FormDataStructure[];
}

export function schemaToDataStructure(
  field: SchemaField
): string | FormDataStructure | FormDataStructure[] {
  if (['root', 'object'].includes(field.type)) {
    return Object.entries(
      (field as SchemaFieldObject).properties
    ).reduce<FormDataStructure>((acc, [key, value]) => {
      return {
        ...acc,
        [key]: schemaToDataStructure(value)
      };
    }, {});
  }

  if (field.type === 'array') {
    if ((field.minItems || 0) > 0) {
      return Array.from({ length: field.minItems as number }).map(() => ({
        value: schemaToDataStructure(field.items)
      }));
    }
    return [];
  }

  return '';
}
