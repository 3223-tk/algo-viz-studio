import { defineConfig } from 'vitest/config';

// Kept separate from vite.config.ts so the test runner and the bundler can
// each use their own Vite type tree without plugin type conflicts.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    reporters: 'default',
  },
});
