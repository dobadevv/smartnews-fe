import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));
const fromRoot = (relativePath: string) => path.join(rootDirectory, relativePath);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${rootDirectory}/` },
      { find: /^server-only$/, replacement: fromRoot('test/stubs/server-only.ts') },
      { find: /^next\/image$/, replacement: fromRoot('test/stubs/next-image.tsx') },
      { find: /^next\/link$/, replacement: fromRoot('test/stubs/next-link.tsx') },
    ],
  },
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**'],
  },
});
