import { Plugin, SchemaFieldObject } from '@stac-manager/data-core';

export class PluginCore extends Plugin {
  name = 'CollectionsCore';

  // async init(data) {
  //   await new Promise((resolve) => setTimeout(resolve, 100));
  // }

  editSchema(): SchemaFieldObject {
    return {
      type: 'root',
      // required: [
      //   'id',
      //   'description',
      //   'license',
      //   'spatial',
      //   'temporal',
      //   'links'
      // ],
      properties: {
        id: {
          label: 'Collection ID',
          type: 'string'
        },
        title: {
          label: 'Title',
          type: 'string'
        },
        description: {
          label: 'Description',
          type: 'string'
        },
        keywords: {
          type: 'array',
          label: 'Keywords',
          items: {
            label: 'Keyword',
            type: 'string'
          }
        },
        license: {
          label: 'License',
          type: 'string'
        },
        providers: {
          type: 'array',
          label: 'Providers',
          items: {
            type: 'object',
            required: ['name'],
            properties: {
              name: {
                label: 'Name',
                type: 'string'
              },
              roles: {
                label: 'Roles',
                type: 'array',
                items: {
                  label: 'Role',
                  type: 'string',
                  enum: [
                    ['licensor', 'Licensor'],
                    ['producer', 'Producer'],
                    ['processor', 'Processor'],
                    ['host', 'Host']
                  ]
                }
              },
              url: {
                label: 'URL',
                type: 'string'
              }
            }
          }
        },
        stac_extensions: {
          type: 'array',
          label: 'STAC Extensions',
          items: {
            label: 'Extension',
            type: 'string'
          }
        },
        spatial: {
          label: 'Spatial Extent',
          type: 'array',
          minItems: 1,
          items: {
            type: 'array',
            label: 'Extent',
            minItems: 4,
            maxItems: 4,
            items: {
              label: [
                'Min Longitude',
                'Min Latitude',
                'Max Longitude',
                'Max Latitude'
              ],
              type: 'number'
            }
          }
        },
        temporal: {
          label: 'Temporal Extent',
          type: 'array',
          minItems: 1,
          items: {
            type: 'array',
            label: 'Extent',
            minItems: 2,
            maxItems: 2,
            items: {
              label: ['Start', 'End'],
              type: 'string'
            }
          }
        },
        links: {
          type: 'array',
          label: 'Links',
          minItems: 1,
          items: {
            type: 'object',
            // required: ['rel', 'href'],
            properties: {
              href: {
                label: 'URL',
                type: 'string'
              },
              rel: {
                label: 'Relation',
                type: 'string'
              },
              type: {
                label: 'Type',
                type: 'string'
              },
              title: {
                label: 'Title',
                type: 'string'
              }
            }
          }
        },
        assets: {
          type: 'array',
          label: 'Assets',
          items: {
            type: 'object',
            // required: ['id', 'href'],
            properties: {
              id: {
                label: 'Id',
                type: 'string'
              },
              href: {
                label: 'Href',
                type: 'string'
              },
              title: {
                label: 'Title',
                type: 'string'
              },
              description: {
                label: 'Description',
                type: 'string'
              },
              type: {
                label: 'Type',
                type: 'string'
              },
              roles: {
                label: 'Roles',
                type: 'array',
                items: {
                  label: 'Role',
                  type: 'string'
                }
              }
            }
          }
        },
        summaries: {
          type: 'json',
          label: 'Summaries'
        }
      }
    };
  }

  enterData(data: any = {}) {
    return {
      id: data?.id,
      title: data?.title,
      description: data?.description,
      keywords: data?.keywords || [],
      license: data?.license,
      providers: data?.providers || [],
      stac_extensions: data?.stac_extensions,
      spatial: data?.extent?.spatial.bbox || [],
      temporal: data?.extent?.temporal.bbox || [],
      links: data?.links || [],
      assets: Object.entries<Record<string, any>>(data?.assets || {}).map(
        ([key, value]) => ({
          id: key,
          ...value
        })
      ),
      summaries: data?.summaries || {}
    };
  }

  exitData(data: any) {
    return {
      type: 'Collection',
      stac_version: '1.0.0',
      id: data.id,
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      license: data.license,
      providers: data.providers,
      stac_extensions: data.stac_extensions,

      extent: {
        spatial: {
          bbox: [data.spatial?.map(({ value }: any) => Number(value))]
        },
        temporal: {
          interval: [data.temporal?.map(({ value }: any) => value)]
        }
      },

      links: data.links,
      assets: (data.assets as Record<string, any>[]).reduce(
        (acc, asset: Record<string, any>) => {
          return {
            ...acc,
            [asset.id]: asset
          };
        },
        {}
      ),
      summaries: data.summaries
    };
  }
}
