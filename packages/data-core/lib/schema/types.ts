export interface SchemaFieldString {
  type: 'string';
  'ui:widget'?: string;
  label?: string;
  enum?: [string, string][];
}

export interface SchemaFieldArray<I extends SchemaField = SchemaField> {
  type: 'array';
  'ui:widget'?: string;
  label?: string;
  minItems?: number;
  maxItems?: number;
  items: I;
}

export interface SchemaFieldObject {
  type: 'object' | 'root';
  'ui:widget'?: string;
  label?: string;
  properties: Record<string, SchemaField>;
  required?: string[];
}

export type SchemaField =
  | SchemaFieldString
  | SchemaFieldArray
  | SchemaFieldObject;
