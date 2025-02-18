import { BaseRecord, ComponentLoader, ResourceWithOptions } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';

import orm from 'orm';
import uploadFileFeature, { UploadOptions } from '@adminjs/upload';
import { resolve } from 'path';

export const componentLoader = new ComponentLoader();

type FileField = { field: string; name: string };
type Options = {
  fileFields: Array<FileField>;
  uploadCallback: (
    record: BaseRecord,
    filename: string,
    key: FileField,
  ) => VoidPromise;
  uploadFileFeature: Partial<
    Omit<UploadOptions, 'componentLoader' | 'provider'>
  > & {
    provider: UploadOptions['provider'];
  };
};

const hideField = (fieldName: string) => ({
  [fieldName]: {
    isVisible: {
      show: false,
      list: false,
      edit: false,
      filter: false,
    },
  },
});

export const createResourceWithFile = (
  modelName: string,
  options: Options,
): ResourceWithOptions => {
  const hidenFields: Record<string, unknown> = {};

  options.fileFields
    .map(fileField => hideField(fileField.field))
    .forEach(hideField => {
      const indexOfField = Object.keys(hideField)[0];

      hidenFields[indexOfField] = hideField[indexOfField];
    });

  const { uploadCallback } = options;

  return {
    resource: {
      model: getModelByName(modelName),
      client: orm,
    },
    options: {
      // @ts-ignore
      properties: {
        ...hidenFields,
      },
    },
    features: [
      ...options.fileFields.map(fileField => {
        return uploadFileFeature({
          ...options.uploadFileFeature,
          uploadPath(record, filename) {
            uploadCallback(record, filename, fileField);

            return !!options.uploadFileFeature?.uploadPath
              ? options.uploadFileFeature.uploadPath(record, filename)
              : `${record.id()}/${filename}`;
          },

          properties: {
            key: fileField.field,
            file: fileField.name,
            filePath: fileField.field,
            filesToDelete: fileField.field,
          },
          componentLoader: componentLoader,
        });
      }),
    ],
  };
};
