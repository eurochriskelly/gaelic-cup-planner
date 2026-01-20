import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src/interfaces/report'),
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'), // Define ~ alias to point to project root
    },
  },
  plugins: [react()],
  publicDir: resolve(__dirname, 'src/interfaces/report/public'),
  server: {
    proxy: {
      '/api': 'http://localhost:4001',
    },
    port: 5175
  },
  build: {
    outDir: resolve(__dirname, process.env.BUILD_ENV ? `dist/${process.env.BUILD_ENV}/report` : 'dist/report'),
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
