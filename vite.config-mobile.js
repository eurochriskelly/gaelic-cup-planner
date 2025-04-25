import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

const port = process.env.GG_PORT_OVERRIDE || '4010'
export default defineConfig({
  root: resolve(__dirname, 'src/interfaces/mobile'),
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'), // Define ~ alias to point to project root
    },
  },
  plugins: [react(), svgr()],
  publicDir: resolve(__dirname, 'src/interfaces/mobile/public'),
  server: {
    proxy: {
      '/api': 'http://localhost:' + port,
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist/mobile'),
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
