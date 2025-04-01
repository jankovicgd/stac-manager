import { extendPluginConfig } from './index';
import { PluginConfig } from './index';

describe('extendPluginConfig', () => {
  it('should merge multiple configurations', () => {
    const config1: Partial<PluginConfig> = {
      collectionPlugins: [{ name: 'plugin1' } as any],
      itemPlugins: [{ name: 'itemPlugin1' } as any],
      'ui:widget': { widget1: () => null }
    };

    const config2: Partial<PluginConfig> = {
      collectionPlugins: [{ name: 'plugin2' } as any],
      'ui:widget': { widget2: () => null }
    };

    const result = extendPluginConfig(config1, config2);

    expect(result).toEqual({
      collectionPlugins: [{ name: 'plugin1' }, { name: 'plugin2' }],
      itemPlugins: [{ name: 'itemPlugin1' }],
      'ui:widget': {
        widget1: expect.any(Function),
        widget2: expect.any(Function)
      }
    });
  });

  it('should handle empty configurations', () => {
    const result = extendPluginConfig();
    expect(result).toEqual({
      collectionPlugins: [],
      itemPlugins: [],
      'ui:widget': {}
    });
  });

  it('should override properties with later configurations', () => {
    const config1: Partial<PluginConfig> = {
      'ui:widget': { widget1: () => 'old' }
    };

    const config2: Partial<PluginConfig> = {
      'ui:widget': { widget1: () => 'new' }
    };

    const result = extendPluginConfig(config1, config2);

    expect(result['ui:widget'].widget1({} as any)).toBe('new');
  });
});
