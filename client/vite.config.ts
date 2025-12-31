import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
// import vueDevTools from 'vite-plugin-vue-devtools'

const env = loadEnv(process.cwd(), '../')

process.env.VITE_API_PORT = env.VITE_API_PORT

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
  build: {
    chunkSizeWarningLimit: 500,
    outDir: '../server/public',
    emptyOutDir: true,
  },
  base: env.VITE_BASE_PORT,
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 8080,
  },
});
