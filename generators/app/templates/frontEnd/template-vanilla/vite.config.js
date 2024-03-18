import { defineConfig } from 'vite'
import { VscodePlugin } from './plugin'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [VscodePlugin()]
})
