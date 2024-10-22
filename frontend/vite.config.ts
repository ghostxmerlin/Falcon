import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), basicSsl(), NodeGlobalsPolyfillPlugin({
        process: true,
        buffer: true,
    }),],
    resolve: {
        alias: {
          crypto: 'crypto-browserify',
          stream: 'stream-browserify',
          buffer: 'buffer',
        },
      },
      define: {
        'process.env': {},
      },
    build: {
        outDir: './docs',
    },
    base: './',
    server: {
        port: 5174,
    },
});
