import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL ?? 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target:    'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:     ['react', 'react-dom', 'react-router-dom'],
          state:      ['@reduxjs/toolkit', 'react-redux'],
          i18n:       ['i18next', 'react-i18next'],
        },
      },
    },
  },
});
