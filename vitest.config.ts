import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html', 'lcov']
    },
    include: [
      'packages/**/src/**/*.{test,spec}.{ts,tsx,js,jsx}',
      'apps/**/src/**/*.{test,spec}.{ts,tsx,js,jsx}'
    ]
  }
});
