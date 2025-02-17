import { defineWorkspace } from 'vitest/config';

const asyncPaths = [
  './src/app/tests/browser/async/**/*.unit.test.ts',
  './src/app/tests/browser/async/**/*.unit.test.tsx',
  './src/app/tests/browser/async/**/*.integration.test.ts',
  './src/app/tests/browser/async/**/*.integration.test.tsx',
];

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      environment: 'jsdom',
      name: 'unit-browser',
      mockReset: true,
      include: [
        './src/app/tests/browser/**/*.unit.test.ts',
        './src/app/tests/browser/**/*.unit.test.tsx',
      ],
      exclude: asyncPaths,
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      environment: 'jsdom',
      mockReset: true,
      name: 'integration-browser',
      include: [
        './src/app/tests/browser/**/*.integration.test.ts',
        './src/app/tests/browser/**/*.integration.test.tsx',
      ],
      exclude: asyncPaths,
    },
  },

  {
    extends: './vitest.config.ts',
    test: {
      environment: 'jsdom',
      mockReset: true,
      name: 'async-browser',
      include: asyncPaths,
    },
  },

  {
    extends: './vitest.config.ts',
    test: {
      environment: 'node',
      name: 'unit-server',
      include: ['./src/app/tests/server/**/*.unit.test.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      environment: 'node',
      name: 'integration-server',
      include: ['./src/app/tests/server/**/*.integration.test.ts'],
    },
  },
]);
