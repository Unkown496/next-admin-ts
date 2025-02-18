import { styleText } from 'node:util';

import ora from 'ora';

import swaggerExpress, {
  Options as OptionsSwagger,
} from 'express-jsdoc-swagger';
import { Express } from 'express';
import { inApp } from './path.js';

type Options = Omit<
  OptionsSwagger,
  'baseDir' | 'filesPattern' | 'exposeApiDocs' | 'multiple'
>;

export class Swagger {
  constructor(options: Options, app: Express) {
    const loadSwagger = ora({
      text: 'Initialization swagger...',
      hideCursor: true,
      prefixText: styleText('magenta', 'swagger:'),
    });

    loadSwagger.start();

    const { swaggerUIPath = '/api/docs' } = options;

    if (app.get('isDev'))
      swaggerExpress(app)({
        ...options,

        swaggerUIPath,

        baseDir: inApp('api'),
        filesPattern: ['./**/*.ts', './**/*.tsx'],
        exposeApiDocs: false,
        multiple: true,
      } as OptionsSwagger);
    else
      loadSwagger.stopAndPersist({
        text: 'In production mode swagger not initilazation!',
      });

    loadSwagger.stopAndPersist({
      text: `Swagger successfylly running at ${styleText(
        'green',
        swaggerUIPath,
      )}`,
    });
  }
}
