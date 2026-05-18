import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const apiTarget = env.VITE_API_TARGET || 'http://localhost:5050'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/real-estate': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
