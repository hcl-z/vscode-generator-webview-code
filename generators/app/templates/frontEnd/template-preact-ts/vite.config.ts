import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { VscodePlugin } from './plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), VscodePlugin()],
})
