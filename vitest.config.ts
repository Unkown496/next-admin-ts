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
        'server.js',
        'locales',
        'public',
        'prisma',
        'generate',

        // ignore root layout
        'src/app/layout.jsx',
        'src/app/layout.js',

        // ignore server utils func
        'utils/**/*.js',

        // configs
        '**/*.config.js',
        '**/vitest.*.js',

        // mocks files
        '**/__mocks__/**/*.js',
        '**/__mocks__/**/*.jsx',

        // small helpers func
        '**/helpers/**/*.js',
        'utils/**/*.js',

        // seeds
        '**/seeds/**/*.js',

        // cli files
        '**/cli/*.js',
        '**/cli/**/*.js',
      ],
    },
  },
  define: {
    'import.meta.env': {
      ...process.env,
    },
  },
});
