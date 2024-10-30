import { extendPluginConfig } from '@stac-manager/data-core';

import { WidgetText } from '../widgets/text';
import { WidgetRadio } from '../widgets/radio';
import { WidgetCheckbox } from '../widgets/checkbox';
import { WidgetObject } from '../widgets/object';
import { WidgetArray } from '../widgets/array';
import { WidgetArrayString } from '../widgets/array-string';
import { WidgetSelect } from '../widgets/select';

export const defaultPluginWidgetConfig = extendPluginConfig({
  'ui:widget': {
    object: WidgetObject,
    text: WidgetText,
    radio: WidgetRadio,
    checkbox: WidgetCheckbox,
    select: WidgetSelect,
    array: WidgetArray,
    'array:string': WidgetArrayString
  }
});
