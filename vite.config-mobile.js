import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

const port = process.env.GG_PORT_OVERRIDE || '4000'
export default defineConfig({
  root: resolve(__dirname, 'src/interfaces/mobile'),
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'), // Define ~ alias to point to project root
    },
  },
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pp-whistle.png'],
      manifest: {
        name: 'Pitch Perfect Coordination',
        short_name: 'PitchPerfect',
        description: 'A mobile application for coordinating pitch activities',
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
  publicDir: resolve(__dirname, 'src/interfaces/mobile/public'),
  server: {
    proxy: {
      '/api': 'http://localhost:' + port,
    },
    allowedHosts: [
      'gge-blitz-tournament.duckdns.org',
      'coordinate.pitchperfect.eu.com',
      'app.pitchperfect.eu.com',
      'test-coordinate.pitchperfect.eu.com'
    ]
  },
  build: {
    outDir: resolve(__dirname, process.env.BUILD_ENV ? `dist/${process.env.BUILD_ENV}/mobile` : 'dist/mobile'),
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
