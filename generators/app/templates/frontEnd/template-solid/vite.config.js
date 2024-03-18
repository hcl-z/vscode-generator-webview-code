import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { VscodePlugin } from './plugin'
export default defineConfig({
    plugins: [solid(), VscodePlugin()]
})
