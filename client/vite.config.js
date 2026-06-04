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
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom') || id.includes('react-router') || id.includes('@remix-run')) {
              return 'vendor-router';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('react-pageflip')) {
              return 'vendor-pageflip';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})

