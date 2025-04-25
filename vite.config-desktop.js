import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src/interfaces/desktop'),
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'), // Define ~ alias to point to project root
    },
  },
  plugins: [react()],
  publicDir: resolve(__dirname, 'src/interfaces/desktop/public'),
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
    port: 5174
  },
  build: {
    outDir: resolve(__dirname, 'dist/desktop'),
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
