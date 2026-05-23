import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve the Assets folder as the public directory
  // so files are accessible at /assets/... URL paths
  publicDir: path.resolve(__dirname, 'Assets'),
})
