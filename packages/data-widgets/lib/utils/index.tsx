import React from 'react';
import { Text } from '@chakra-ui/react';
import { SchemaField } from '@stac-manager/data-core';

/**
 * Calculates the integer remainder of a division of a by n, handling negative
 * modulo in the mathematically expected way.
 *
 * This is very helpful for cycling array indexes.
 * If the current index is the first, the last is returned, and vice-versa.
 *
 * Given an index if we want to know the previous:
 * @example
 *   const arr = [1, 2, 3];
 *   const arrIdx = 0;
 *   const newIdx = mod(arrIdx - 1, arr.length); // 2
 *
 * @param {number} a Dividend
 * @param {number} n Divisor
 */
export function mod(a: number, n: number) {
  return ((a % n) + n) % n;
}

/**
 * Generates a label for an array item based on the provided field and index. If
 * the provided label is a single string, the label is returned with a number
 * suffix. (Eg: Label 01)
 * If the label is an array of strings, the label is cycled based on the index.
 *
 * @param {SchemaField} field - The schema field containing label information.
 * @param {number} index - The index of the array item.
 * @returns {object | null} An object containing the label, number, and
 * formatted JSX element, or null if the label is null.
 */
export function getArrayLabel(field: SchemaField, index: number) {
  const label = field.label === undefined ? 'Item' : field.label;
  if (label === null) {
    return null;
  }

  if (typeof label === 'string') {
    const n = index + 1;
    return {
      label: label,
      num: n,
      formatted: (
        <>
          <Text as='span'>{label}</Text>{' '}
          <Text as='small'>{n <= 9 ? `0${n}` : n}</Text>
        </>
      )
    };
  }

  const l = label[mod(index, label.length)];
  return {
    label: l,
    num: null,
    formatted: l
  };
}

/**
 * Converts a given value to a number.
 *
 * @param v - The value to convert.
 * @returns The numeric representation of the value, or null if the value cannot
 * be converted to a number.
 */
export function toNumber(v: any) {
  const n = Number(v);
  return isNaN(n) ? null : n;
}

/**
 * Ensures that the provided value is returned as an array.
 * If the value is already an array, it is returned as-is.
 * Otherwise, the value is wrapped in an array.
 *
 * @param {T | T[]} value - The value to be cast to an array.
 * @returns {T[]} The value as an array.
 */
export function castArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
