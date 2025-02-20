import 'dotenv/config';

import express from 'express';

// express-helmet plugin
import helmet from 'helmet';

import App from './utils/app';
import { Models } from './utils/admin';

import { Admin, File } from 'resources';

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

const useAdminFiles = () => express.static('C://public/files');

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
