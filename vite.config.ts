import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import dynamicImport from 'vite-plugin-dynamic-import'
import { VitePWA } from 'vite-plugin-pwa'

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
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: false, // Aktifkan PWA saat development (opsional)
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: env.MIGIOS_NAME || 'Migios',
          short_name: env.MIGIOS_NAME || 'Migios',
          description: 'Aplikasi Migios',
          theme_color: '#3951c6',
          icons: [
            {
              src: '/android-icon-36x36.png',
              sizes: '36x36',
              type: 'image/png'
            },
            {
              src: '/android-icon-48x48.png',
              sizes: '48x48',
              type: 'image/png'
            },
            {
              src: '/android-icon-72x72.png',
              sizes: '72x72',
              type: 'image/png'
            },
            {
              src: '/android-icon-96x96.png',
              sizes: '96x96',
              type: 'image/png'
            },
            {
              src: '/android-icon-144x144.png',
              sizes: '144x144',
              type: 'image/png'
            },
            {
              src: '/android-icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            }
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
                },
              },
            },
          ],
        },
      }),
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
    base: '/',
    server: {
      host: true,
      port: 5123,
      allowedHosts: true, // Allow all hosts
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:3000',
      //     changeOrigin: true,
      //     secure: false,
      //   }
      // }
    },
    preview: {
      host: true,
      port: 5123,
      allowedHosts: true, // Allow all hosts
    },
    build: {
      chunkSizeWarningLimit: 10000,
      // build jadi 1 file
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  }
})
