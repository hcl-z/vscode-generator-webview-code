import { defineConfig } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    qwikVite({
      csr: true,
    }),
  ],
  build: {
    outDir: "build",
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
})
