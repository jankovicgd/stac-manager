import { cloneDeep } from 'lodash-es';
import { Plugin, PluginConfigItem } from './plugin';

/**
 * Resolves the plugin config.
 *
 * @param plugins - An array of plugin configuration items which can be
 * instances of `Plugin` or functions that return a `Plugin`.
 * @param data - The data to be passed to plugin functions if they are not
 * instances of `Plugin`.
 * @returns An array of processed `Plugin` instances after applying hooks.
 */
export const resolvePlugins = (plugins: PluginConfigItem[], data: any) => {
  const p = plugins
    .flatMap((pl) => {
      if (pl instanceof Plugin) {
        return pl;
      } else if (typeof pl === 'function') {
        return pl(data);
      }
      return;
    })
    .filter((p) => p instanceof Plugin);

  return applyHooks(p);
};

/**
 * Applies hooks from the provided plugins to their respective targets.
 *
 * This function iterates over each plugin and applies hooks such as
 * `onAfterInit` and `onAfterEditSchema` to the corresponding target plugins.
 * The hooks are executed in the context of the source plugin.
 *
 * @param plugins - List of plugins. All the source and target plugins must be
 * on the list.
 *
 *
 * @remarks
 * - The `onAfterInit` hook is executed after the target plugin's `init`
 *   function.
 * - The `onAfterEditSchema` hook is composed with the target plugin's
 *   `editSchema` function.
 *
 * @example
 * ```typescript
 * class MyPlugin extends Plugin {
 *  name = 'MyPlugin';
 *
 *  [Plugin.HOOKS]: [
 *   {
 *     name: 'pluginA', // Target plugin
 *     onAfterInit: async (targetInstance, data) => { },  // Executes after pluginA's init function.
 *     onAfterEditSchema: (targetInstance, formData, origEditSchema) => { } // Composes with pluginA's editSchema function and returns a new one.
 *   },
 *   {
 *     name: 'pluginB', // Target plugin
 *     onAfterInit: async (targetInstance, data) => { }, // Executes after pluginB's init function.
 *   }
 *  ];
 * }
 *
 * applyHooks(plugins);
 * ```
 */
export const applyHooks = (plugins: Plugin[]) => {
  const pluginsCopy = cloneDeep(plugins);

  for (const plSource of pluginsCopy) {
    for (const hook of plSource[Plugin.HOOKS]) {
      // Target where to apply the hook
      const plTarget = plugins.find((p) => p.name === hook.name);
      if (!plTarget) {
        continue;
      }

      // The onAfterInit hook is made by executing one function after another.
      if (hook.onAfterInit) {
        const fn = hook.onAfterInit;
        const origInit = plTarget.init;
        plTarget.init = async (data: any) => {
          await origInit.call(plTarget, data);
          await fn.call(plSource, plTarget, data);
        };
      }

      // The onAfterEditSchema hook is made by composing functions.
      if (hook.onAfterEditSchema) {
        const fn = hook.onAfterEditSchema;
        const origEditSchema = plTarget.editSchema;
        plTarget.editSchema = (formData?: any) => {
          return fn.call(
            plSource,
            plTarget,
            formData,
            origEditSchema.call(plTarget, formData)
          );
        };
      }
    }
  }

  return pluginsCopy;
};
