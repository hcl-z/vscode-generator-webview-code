import { defineConfig } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'
import { VscodePlugin } from './plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    qwikVite({
      csr: true,
    }),
    VscodePlugin()
  ]
})
