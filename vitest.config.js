import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['dotenv/config'],
    // Mematikan eksekusi paralel agar tes database mengantre satu per satu
    fileParallelism: false,
  },
});