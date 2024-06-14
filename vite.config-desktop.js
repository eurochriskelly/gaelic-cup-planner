import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src/frontend/interfaces/desktop'),
  plugins: [react()],
  publicDir: resolve(__dirname, 'src/frontend/interfaces/desktop/public'),
  server: {
    proxy: {
      '/api': 'http://localhost:4001',
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist/desktop'),
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
