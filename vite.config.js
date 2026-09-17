import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Split large bundles into smaller chunks for faster parallel loading
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React (shared across all pages)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation library
          'vendor-motion': ['framer-motion'],
          // Firebase SDK (loaded after initial render)
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Icons
          'vendor-icons': ['react-icons'],
        },
      },
    },
    // Increase warning limit for Firebase SDK chunk
    chunkSizeWarningLimit: 700,
  },
})
