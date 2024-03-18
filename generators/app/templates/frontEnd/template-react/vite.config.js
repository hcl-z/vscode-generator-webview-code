import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VscodePlugin } from './plugin'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VscodePlugin()]
})
