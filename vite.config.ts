import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      dynamicImport(),
      // eslint({
      //   cache: false,
      //   // failOnError: true,
      //   // failOnWarning: false,
      //   include: ['src/**/*.ts', 'src/**/*.tsx'],
      //   exclude: ['**/node_modules/**'],
      // }),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/__tests__/setup.ts'],
    },
    define: {
      'process.env': env,
      global: {},
    },
    assetsInclude: ['**/*.md'],
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
      },
    },
    server: {
      host: true,
      port: 5123,
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:3000',
      //     changeOrigin: true,
      //     secure: false,
      //   }
      // }
    },
    build: {
      outDir: 'build',
      chunkSizeWarningLimit: 5000,
      // build jadi 1 file
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  }
})
