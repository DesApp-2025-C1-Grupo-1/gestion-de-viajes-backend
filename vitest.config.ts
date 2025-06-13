/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    swc.vite({
      module: {
        type: 'es6',
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    watch: false,
    include: ['test/**/*.spec.ts'],
    setupFiles: ['test/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'test/**/*.spec.ts',
        'test/**/*.e2e-spec.ts',
        'src/**/*.dto.ts',
        'src/**/*.schema.ts',
        'src/main.ts',
      ],
    },
  },
});
