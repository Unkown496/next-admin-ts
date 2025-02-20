import { UploadFeature } from '../utils/adminFiles';

export const localProvider = {
  bucket: 'C://public/files',
  opts: {
    baseUrl: '/public/files',
  },
};

export const File = new UploadFeature({
  resource: {
    modelName: 'File',
    options: {
      navigation: {
        name: '',
        icon: 'File',
      },
    },
  },
  props: {
    key: 's3Key',
    file: 'photo',
  },
  names: ['photo'],

  provider: {
    local: localProvider,
  },
});
