import React from 'react';
import {
  WidgetRenderer,
  SchemaFieldObject,
  WidgetProps
} from '@stac-manager/data-core';

export function WidgetObject(props: WidgetProps) {
  const { pointer } = props;
  const field = props.field as SchemaFieldObject;

  return Object.entries(field.properties).map(([key, item]) => (
    <WidgetRenderer
      key={key}
      pointer={pointer ? `${pointer}.${key}` : key}
      field={item}
      isRequired={field.required?.includes(key)}
    />
  ));
}
