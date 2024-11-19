import { SchemaField } from '@stac-manager/data-core';

/**
 *
 * @param condition The condition to evaluate
 * @param id The id for the field
 * @param ifTrue Field schema to associate to id if condition is true
 * @param ifFalse Field schema to associate to id if condition is false
 * @returns
 */
export function fieldIf<I extends string>(
  condition: boolean,
  id: I,
  ifTrue: SchemaField,
  ifFalse?: SchemaField
) {
  return (
    condition
      ? {
          [id]: ifTrue
        }
      : ifFalse
        ? {
            [id]: ifTrue
          }
        : {}
  ) as Record<I, SchemaField>;
}

/**
 * Recursively converts empty strings in arrays to null.
 */
export function emptyString2Null(v: any): any {
  if (Array.isArray(v)) {
    return v.map(emptyString2Null);
  }

  return v === '' ? null : v;
}

/**
 * Recursively converts nulls in arrays to empty strings.
 */
export function null2EmptyString(v: any): any {
  if (Array.isArray(v)) {
    return v.map(null2EmptyString);
  }

  return v === null ? '' : v;
}
