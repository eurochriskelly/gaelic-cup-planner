import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src/frontend/interfaces/mobile'),
  plugins: [react()],
  publicDir: resolve(__dirname, 'src/frontend/interfaces/mobile/public'),
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
