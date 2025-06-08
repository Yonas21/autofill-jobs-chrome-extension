import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import webExtension from '@samrum/vite-plugin-web-extension'

export default defineConfig({
  root: resolve(__dirname, 'src'),
  plugins: [
    vue(),
    webExtension({
      manifest: {
        name: 'Job Application Auto-Filler',
        version: '1.0',
        manifest_version: 3,
        action: {
          default_popup: 'popup/index.html',
          default_icon: 'icons/icon128.png'
        },
        icons: {
          "16": "icons/icon16.png",
          "48": "icons/icon48.png",
          "128": "icons/icon128.png"
        },
        permissions: ['storage', 'activeTab'],
        content_scripts: [
          {
            matches: ['*://*/*'],
            js: ['content/content.js']
          }
        ],
        background: {
          service_worker: 'background/background.js'
        }
      }
    })
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/background.js'),
        content: resolve(__dirname, 'src/content/content.js')
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.png')) {
            return 'icons/[name][extname]'
          }
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: (assetInfo) => {
          if (assetInfo.name.includes('background')) {
            return 'background/[name].js'
          }
          if (assetInfo.name.includes('content')) {
            return 'content/[name].js'
          }
          return 'assets/[name].js'
        }
      }
    }
  },
  publicDir: resolve(__dirname, 'public') // Add this if you have a public directory
})