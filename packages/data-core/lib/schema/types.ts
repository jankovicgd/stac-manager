export interface SchemaFieldString {
  type: 'string';
  'ui:widget'?: string;
  label?: string | string[];
  enum?: [string, string][];
}

export interface SchemaFieldNumber {
  type: 'number';
  'ui:widget'?: string;
  label?: string | string[];
}

export interface SchemaFieldJson {
  type: 'json';
  'ui:widget'?: string;
  label?: string;
}

export interface SchemaFieldArray<I extends SchemaField = SchemaField> {
  type: 'array';
  'ui:widget'?: string;
  label?: string | string[];
  minItems?: number;
  maxItems?: number;
  items: I;
}

export interface SchemaFieldObject {
  type: 'object' | 'root';
  'ui:widget'?: string;
  label?: string | string[];
  properties: Record<string, SchemaField>;
  required?: string[];
}

export type SchemaField =
  | SchemaFieldString
  | SchemaFieldArray
  | SchemaFieldObject
  | SchemaFieldNumber
  | SchemaFieldJson;
