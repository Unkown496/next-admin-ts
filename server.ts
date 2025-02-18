import 'dotenv/config';

// express-helmet plugin
import helmet from 'helmet';

import App from './utils/app';

const useHelmet = () =>
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  });

const app = new App(['Admin'], {
  isProduction: process.env.NODE_ENV === 'production',
  port: +process.env.PORT || 3000,

  cookieSecret: process.env.COOKIE_SECRET || 'secret',

  usePlugins(server) {
    server.use(useHelmet());
  },
});

app.init();
