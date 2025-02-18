import 'dotenv/config';

// express-helmet plugin
import helmet from 'helmet';

import App from './utils/app';
import { componentLoader } from './utils/adminFiles';
import { Models } from './utils/admin';

import orm from 'orm';
import { getModelByName } from '@adminjs/prisma';
import uploadFileFeature from '@adminjs/upload';

const useHelmet = () =>
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  });

const props = () => ({
  bucket: {
    type: 'string',
    isVisible: false,
  },
  mime: {
    type: 'string',
    isVisible: false,
  },
  s3Key: {
    type: 'string',
    isVisible: false,
  },
  size: {
    type: 'number',
    isVisible: false,
  },
});

const propsFor = (name?: string, multiple: boolean = false) => {
  const propsTo = props();

  return Object.keys(propsTo).reduce(
    (memo, key) => ({
      ...memo,
      [`${name}.${key}`]: propsTo[key],
    }),
    {},
  );
};

const uploadFetureFor = (name: string) => {
  return uploadFileFeature({
    componentLoader,
    provider: {
      local: {
        bucket: 'C://public/files',
        opts: { baseUrl: 'C://public/files' },
      },
    },
    properties: {
      key: name ? `photo.s3Key` : 'photo.s3Key',
    },
  });
};
const models: Models = [
  {
    resource: ,
    options: {
      properties: {
        fileId: {
          isVisible: false,
        },
        photoId: {
          isVisible: false,
        },

        file: {
          type: 'mixed',
        },
      },
    },
    features: [uploadFetureFor('')],
  },
  'File',
];

const app = new App(models, {
  isProduction: process.env.NODE_ENV === 'production',
  port: +process.env.PORT || 3000,

  cookieSecret: process.env.COOKIE_SECRET || 'secret',

  usePlugins(server) {
    server.use(useHelmet());
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
