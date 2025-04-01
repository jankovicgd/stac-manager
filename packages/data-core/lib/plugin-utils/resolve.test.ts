import { resolvePlugins, applyHooks } from './resolve';
import { Plugin } from './plugin';

class MockPlugin extends Plugin {
  name = 'MockPlugin';
  init = jest.fn();
  editSchema = jest.fn();
}

describe('resolvePlugins', () => {
  it('should resolve an array of Plugin instances', () => {
    const plugin = new MockPlugin();
    const result = resolvePlugins([plugin], {});
    expect(result).toContainEqual(plugin);
  });

  it('should resolve functions returning Plugin instances', () => {
    const plugin = new MockPlugin();
    const result = resolvePlugins([() => plugin], {});
    expect(result).toContainEqual(plugin);
  });

  it('should filter out invalid items', () => {
    const plugin = new MockPlugin();
    const result = resolvePlugins([plugin, null, undefined], {});
    expect(result).toContainEqual(plugin);
    expect(result.length).toBe(1);
  });
});

describe('applyHooks', () => {
  it('should apply onAfterInit hooks', async () => {
    const targetPlugin = new MockPlugin();
    const sourcePlugin = new MockPlugin();
    sourcePlugin[Plugin.HOOKS] = [
      {
        name: targetPlugin.name,
        onAfterInit: jest.fn()
      }
    ];

    // applyHooks creates a copy, so we need the plugins back.
    const [newTargetPl, newSourcePl] = applyHooks([targetPlugin, sourcePlugin]);
    await newTargetPl.init({});
    expect(newSourcePl[Plugin.HOOKS][0].onAfterInit).toHaveBeenCalled();
  });

  it('should compose onAfterEditSchema hooks', () => {
    const targetPlugin = new MockPlugin();
    const sourcePlugin = new MockPlugin();
    sourcePlugin[Plugin.HOOKS] = [
      {
        name: targetPlugin.name,
        onAfterEditSchema: jest.fn((_, __, origEditSchema) => origEditSchema)
      }
    ];

    // applyHooks creates a copy, so we need the plugins back.
    const [newTargetPl, newSourcePl] = applyHooks([targetPlugin, sourcePlugin]);
    newTargetPl.editSchema({});
    expect(newSourcePl[Plugin.HOOKS][0].onAfterEditSchema).toHaveBeenCalled();
  });

  it('should ignore hooks targeting non-existent plugins', () => {
    const sourcePlugin = new MockPlugin();
    sourcePlugin[Plugin.HOOKS] = [
      {
        name: 'NonExistentPlugin',
        onAfterInit: jest.fn()
      }
    ];

    const plugins = applyHooks([sourcePlugin]);
    expect(plugins).toContainEqual(sourcePlugin);
  });
});
