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

export function getArrayLabel(field: SchemaField, index: number) {
  const label = field.label;
  if (!label) {
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
