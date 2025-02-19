import 'reflect-metadata';

import {
  buildFeature,
  ComponentLoader,
  FeatureType,
  PropertyOptions,
  ResourceWithOptions,
} from 'adminjs';
import { getModelByName } from '@adminjs/prisma';

import orm from 'orm';
import uploadFileFeature, { UploadOptions } from '@adminjs/upload';
import { FeatureCallback, MetadataFeature } from '../types/feature';

type Options = {
  resource: {
    modelName: string;
    options?: ResourceWithOptions['options'];
    feature?: ResourceWithOptions['features'];
  };
  provider: UploadOptions['provider'];
  multiple?: boolean;
  props: UploadOptions['properties'];
  names: string[];
};

export class UploadFeature {
  public uploadProps: Options['props'] = {
    key: '',
    bucket: 'bucket',
    mimeType: 'mime',
    size: 'size',
    file: 'file',
    filename: 'filename',
    filePath: 'filePath',
  };
  public uploadProvider: Options['provider'];
  public resourceOptions: Options['resource'];
  public multiple: boolean;
  public names: Record<string, { type: 'mixed' }>;

  private fileFeature!: FeatureCallback;
  public resource: ResourceWithOptions = {
    resource: undefined,
    options: {},
  };

  constructor(options: Options) {
    const { props, names, provider, resource, multiple = false } = options;

    this.uploadProps = { ...this.uploadProps, ...props };
    this.uploadProvider = provider;
    this.resourceOptions = resource;
    this.multiple = multiple;
    this.names = names.reduce((_, key) => {
      return {
        [key]: { type: 'mixed' },
      };
    }, {});

    this.init();

    Reflect.defineMetadata(MetadataFeature.ResourceField, 'resource', this);
  }

  private init() {
    this.initFields();
    this.initFeature();
    this.initResource();
  }
  private initFields() {
    const hideFileField: Record<string, PropertyOptions> = {};

    const specificTypeOfField: Record<string, PropertyOptions> = {
      size: {
        type: 'number',
      },
    };

    ['key', 'bucket', 'mimeType', 'size', 'filePath'].forEach(hideFieldKey => {
      // @ts-ignore
      const hideField = this.uploadProps[hideFieldKey] as string;

      hideFileField[hideField] = {
        isVisible: false,
        ...(specificTypeOfField[hideField] ?? { type: 'string' }),
      };
    });
    this.resource.options.properties = {
      ...hideFileField,
    };

    return;
  }
  private initFeature() {
    return (this.fileFeature = () =>
      uploadFileFeature({
        componentLoader,
        provider: this.uploadProvider,
        properties: this.uploadProps,
        multiple: this.multiple,
      }));
  }

  private initResource() {
    this.resource = {
      resource: {
        model: getModelByName(this.resourceOptions.modelName),
        client: orm,
      },
      options: {
        ...this.resourceOptions.options,
        properties: {
          ...this.names,
          ...this.resource?.options.properties,
          ...this.resourceOptions.options?.properties,
        },
      },
      features: [this.fileFeature(), ...(this.resourceOptions?.feature ?? [])],
    };
  }
}

export const componentLoader = new ComponentLoader();

export const Components = {
  ImageShowPreview: componentLoader.add(
    'ImageShowPreview',
    './components/ImageShowPreview',
  ),
  ImageEditPreview: componentLoader.add(
    'ImageEditPreview',
    './components/ImageEditPreview',
  ),
  ImageListPreview: componentLoader.add(
    'ImageListPreview',
    './components/ImageListPreview',
  ),
};

export type FileField = {
  field: string;
  name: string;
};

type OptionsLoadFeature = {
  fileFields: Array<FileField>;
  fileResourceName: string;

  loadOptions: {
    filePath: string;
    fileKey: string;

    bucketKey?: string;
    mimeTypeKey?: string;
    sizeKey?: string;
  };
};
export const loadFeature = (options: OptionsLoadFeature): FeatureType => {
  const {
    fileFields,
    loadOptions = {
      fileKey: '',
      filePath: '',
      bucketKey: 'bucket',
      mimeTypeKey: 'mime',
      sizeKey: 'size',
    },
  } = options;

  const fileProps: Record<string, PropertyOptions> = {};

  fileFields.forEach(file => {
    fileProps[file.field] = {
      isVisible: true,
      components: {
        show: Components.ImageShowPreview,
        edit: Components.ImageEditPreview,
        list: Components.ImageListPreview,
      },
      custom: {
        file: file,
        fileResourceName: options.fileResourceName,
        pathKey: loadOptions.fileKey,
        pathBase: loadOptions.filePath,
      },
    };
  });

  return buildFeature({
    properties: {
      ...fileProps,
    },
  });
};
