import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { authApiMiddleware } from './server/authApi.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'auth-api-middleware',
      configureServer(server) {
        server.middlewares.use('/api/auth', authApiMiddleware);
      },
      configurePreviewServer(server) {
        server.middlewares.use('/api/auth', authApiMiddleware);
      }
    }
  ],
  server: {
    port: 7890,
    strictPort: true,
    host: true,
  }
})

