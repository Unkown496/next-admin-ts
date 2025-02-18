import 'dotenv/config';

import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],

  test: {
    coverage: {
      exclude: [
        // ignore all files bounding of server init
        '.adminjs',
        '.next',
        'server.ts',
        'locales',
        'public',
        'prisma',
        'generate',

        // ignore custom types for typebox and validation handler
        'lib/T.ts',
        'lib/withValidation.ts',

        // orm
        'orm/**/*.ts',

        // ignore root layout
        'src/app/layout.tsx',
        'src/app/layout.ts',

        // ignore server utils func
        'utils/**/*.ts',

        // configs
        '**/*.config.{ts,js}',
        '**/vitest.*.ts',

        // mocks files
        '**/__mocks__/**/*.ts',
        '**/__mocks__/**/*.tsx',

        // small helpers func
        '**/helpers/**/*.ts',
        'utils/**/*.ts',

        // seeds
        '**/seeds/**/*.ts',

        // cli files
        '**/cli/*.ts',
        '**/cli/**/*.ts',
      ],
    },
  },
  define: {
    'import.meta.env': {
      ...process.env,
    },
  },
});
