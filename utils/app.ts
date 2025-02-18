import express, { Express } from 'express';
import next from 'next';

import { styleText } from 'node:util';

import ora from 'ora';

import orm from 'orm';
import Admin, { Options as OptionsAdmin } from './admin';

type Options = {
  port?: number;
  isProduction?: boolean;
  adminOptions?: OptionsAdmin['admin'];

  cookieSecret: string;

  usePlugins?: (
    server: Express,
    options: Pick<Options, 'isProduction' | 'port'>,
  ) => void;
};

const load = ora({
    text: 'Initialization server...',
    hideCursor: true,
    prefixText: styleText('blue', 'server:'),
  }),
  loadAdmin = ora({
    text: 'Initilazation admin app...',
    hideCursor: true,
    prefixText: styleText('magenta', 'admin:'),
  });

const appAuth = async (email: string, password: string) => {
  const token = await orm.admin.singIn({ email, password });

  return token;
};

export default class App {
  private expressServer!: Express;
  private nextServer!: ReturnType<typeof next>;
  private adminApp: Admin;

  public port: number;
  public isProduction: boolean;
  public usePlugins: Options['usePlugins'];

  constructor(models: string[], options: Options) {
    const {
      cookieSecret,
      port = 3000,
      isProduction = false,
      adminOptions = {},
      usePlugins,
    } = options;

    this.adminApp = new Admin(models, {
      auth: appAuth,
      admin: adminOptions,
      cookieSecret,
    });

    this.port = port;
    this.isProduction = isProduction;
    this.usePlugins = usePlugins;
  }

  private initExpress() {
    this.expressServer = express();

    this.expressServer.set('isDev', !this.isProduction);
    this.expressServer.set('port', this.port);

    if (!!this.usePlugins)
      this.usePlugins(this.expressServer, {
        isProduction: this.isProduction,
        port: this.port,
      });

    return;
  }
  private initNext() {
    this.nextServer = next({
      port: this.port,
      dev: !this.isProduction,
      turbopack: true,
    });

    return;
  }
  private initAdmin() {
    loadAdmin.start();

    const admin = this.adminApp.init();

    if (!!admin) {
      this.expressServer.use(
        admin.adminApp.options.rootPath,
        admin.adminRouter,
      );

      loadAdmin.stopAndPersist({
        text: `Admin app successfylly start on path ${styleText(
          'cyan',
          admin.adminApp.options.rootPath,
        )}`,
      });
    } else loadAdmin.stopAndPersist({ text: 'Admin app not started' });
  }

  public init(): void {
    load.start();

    this.initNext();

    this.nextServer.prepare().then(() => {
      this.initExpress();

      const nextHandle = this.nextServer.getRequestHandler();

      this.initAdmin();

      this.expressServer.all('*', (req, res) => nextHandle(req, res));

      this.expressServer.listen(this.port, err => {
        if (err) return this.nextServer.logError(err);

        load.stopAndPersist({
          text: `Server successfilly running at ${styleText(
            'green',
            this.isProduction
              ? `port:${this.port}`
              : `http://localhost:${this.port}`,
          )}`,
        });

        return;
      });
    });
  }
}
