import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

// admin deps
import type { Router } from 'express';

import AdminJS from 'adminjs';
import type { AdminJSOptions, LocaleTranslations } from 'adminjs';
import { buildAuthenticatedRouter } from '@adminjs/express';
import type { AuthenticationOptions } from '@adminjs/express';

import { Database, Resource, getModelByName } from '@adminjs/prisma';

import orm from 'orm';
import { inLocales } from './path';

export type Options = {
  auth: AuthenticationOptions['authenticate'];
  cookieSecret: string;
  admin: Omit<AdminJSOptions, 'resources' | 'rootPath'>;
};

type AutoloadLocalse = Record<string, LocaleTranslations>;

export default class Admin {
  public models: string[];
  public options: Options['admin'];
  public auth: Options['auth'];
  public cookieSecret: string;

  private router!: Router;
  private app!: AdminJS;

  constructor(models: string[], options: Options) {
    const { admin, cookieSecret, auth } = options;

    this.models = models;
    this.options = admin;
    this.cookieSecret = cookieSecret;
    this.auth = auth;
  }

  private loadModels() {
    return this.models.map(modelName => {
      return {
        resource: {
          model: getModelByName(modelName),
          client: orm,
        },
        options: {
          parent: {
            name: '',
          },
        },
      };
    });
  }
  private loadLocales() {
    const adminLocales: AutoloadLocalse = {};

    let localesInDir = readdirSync(resolve('./locales'));
    if (localesInDir.length === 0) return;

    localesInDir = localesInDir.filter(
      localeFile => localeFile.split('.')[1] === 'json',
    );

    localesInDir.forEach(localFileName => {
      const localeData = JSON.parse(
        readFileSync(inLocales(localFileName), 'utf-8'),
      );
      const localeName = localFileName.split('.')[0];

      adminLocales[localeName] = localeData;
    });

    return {
      language: 'en',
      availableLanguages: ['en', ...Object.keys(adminLocales)],
      localeDetection: true,
      translations: {
        ...adminLocales,
      },
    };
  }

  init() {
    if (this.models.length === 0)
      return console.warn("Models is empty, admin dashboard can't initialize!");
    if (!this.auth)
      return console.warn(
        "Auth callback is not defined, can't initialize admin!",
      );

    AdminJS.registerAdapter({ Database, Resource });

    this.app = new AdminJS({
      resources: this.loadModels(),
      locale: this.loadLocales(),
    });

    this.router = buildAuthenticatedRouter(this.app, {
      cookieName: 'adminAuth',
      authenticate: this.auth,
      cookiePassword: this.cookieSecret,
    });

    return {
      adminApp: this.app,
      adminRouter: this.router,
    };
  }
}
