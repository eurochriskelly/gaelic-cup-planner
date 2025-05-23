import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src/interfaces/desktop'),
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'), // Define ~ alias to point to project root
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pp-whistle.png'],
      manifest: {
        name: 'Pitch Perfect Planner',
        short_name: 'PitchPerfect',
        description: 'An application for planning tournaments and coordinating pitch activities',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  publicDir: resolve(__dirname, 'src/interfaces/desktop/public'),
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
    port: 5174
  },
  build: {
    outDir: resolve(__dirname, process.env.ENV ? `dist/${process.env.ENV}/desktop` : 'dist/desktop'),
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
