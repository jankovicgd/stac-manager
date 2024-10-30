/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { SchemaField } from '../schema/types';

export abstract class Plugin {
  static HIDDEN = Symbol('hidden');

  name: string = 'Plugin';

  watchFields?: string[] = [];

  init(data: any) {}

  editSchema(formData?: any): SchemaField | undefined | symbol {
    return undefined;
  }

  enterData(data: any): Record<string, any> {
    throw new Error(`Plugin [${this.name}] must implement enterData`);
  }

  exitData(data: any): Record<string, any> {
    throw new Error(`Plugin [${this.name}] must implement exitData`);
  }
}

export type PluginConfigResolved = Plugin | Plugin[] | undefined | null;

export type PluginConfigResolver = (data: any) => PluginConfigResolved;

export type PluginConfigItem = PluginConfigResolved | PluginConfigResolver;
