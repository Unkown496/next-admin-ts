import 'dotenv/config';

import express from 'express';

// express-helmet plugin
import helmet from 'helmet';

import App from './utils/app';
import { loadFeature, UploadFeature } from './utils/adminFiles';
import { Models } from './utils/admin';
import { getModelByName } from '@adminjs/prisma';
import { ResourceWithOptions } from 'adminjs';

import orm from 'orm';

const useHelmet = () =>
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
      },
    },
  });

const useAdminFiles = () => express.static('public/files');

const localProvider = {
  bucket: 'public/files',
  opts: {
    baseUrl: '/public/files',
  },
};

const Admin = {
  resource: {
    model: getModelByName('Admin'),
    client: orm,
  },
  options: {
    navigation: {
      name: '',
      icon: 'User',
    },
  },
  features: [
    loadFeature({
      fileResourceName: 'File',
      fileFields: [
        { field: 'file', name: 'Файл' },
        { field: 'photo', name: 'Фотка' },
      ],
      loadOptions: {
        filePath: '/public/files/',
        fileKey: 's3Key',
      },
    }),
  ],
} as ResourceWithOptions;
const File = new UploadFeature({
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

const models: Models = [Admin, File];

const app = new App(models, {
  isProduction: process.env.NODE_ENV === 'production',
  port: +process.env.PORT || 3000,

  cookieSecret: process.env.COOKIE_SECRET || 'secret',

  usePlugins(server) {
    server.use(useHelmet());
    server.use('/public/files', useAdminFiles());
  },

  adminOptions: {
    branding: {
      companyName: 'Admin',
      logo: false,
      withMadeWithLove: false,
    },
  },
});

app.init();
