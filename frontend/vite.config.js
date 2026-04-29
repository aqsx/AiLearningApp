
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '127.0.0.1', // Forces IPv4 (bypasses the ::1/IPv6 permission block)
    port: 5173,        // Keep 5173, but it will now listen on 127.0.0.1
    strictPort: true,
  }
})