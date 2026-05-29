import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve the Assets folder as the public directory
  publicDir: path.resolve(__dirname, 'Assets'),
  server: {
    proxy: {
      '/api': {
        target: 'https://mind-waves.runasp.net',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
