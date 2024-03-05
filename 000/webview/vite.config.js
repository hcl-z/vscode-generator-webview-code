import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import plugin from './plugin'
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), libAssetsPlugin({
        name: '[name].[contenthash:8].[ext]',
        outputPath: (string) => 'haha' + string
    })],
    // base: 'http://www.baidu',
    build: {
        outDir: "build",
        assetsInlineLimit: 10000,
        // assetsDir: 'http/trtrt',
        // watch: true,
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
})
