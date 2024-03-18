import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VscodePlugin } from './plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), VscodePlugin()]
});
