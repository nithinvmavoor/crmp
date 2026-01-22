import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,               // listen on 0.0.0.0
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "ec2-13-200-229-186.ap-south-1.compute.amazonaws.com", // TODO: Make this through env variable
    ],
  },
})
