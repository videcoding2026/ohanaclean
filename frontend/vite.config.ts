import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    transformer: "postcss",
  },
  build: {
    cssMinify: false,
  },
  server: {
    proxy: {
      "/api/convex": {
        target: "https://steady-owl-944.convex.cloud",
        changeOrigin: true,
        ws: true,
        rewrite: (p) => p.replace(/^\/api\/convex/, ""),
      },
    },
  },
})
