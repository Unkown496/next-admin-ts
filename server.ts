import 'dotenv/config';

import App from './utils/app';

const app = new App(['Admin'], {
  isProduction: process.env.NODE_ENV === 'production',
  port: +process.env.PORT || 3000,

  cookieSecret: process.env.COOKIE_SECRET || 'secret',
});

app.init();
