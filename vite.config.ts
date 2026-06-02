import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/UT11': {
        target:
          'http://178.20.238.229:2880',

        changeOrigin: true,

        secure: false,
      },
    },
  },
})