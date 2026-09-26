import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import expressApp from './server/index.js'

function expressPlugin() {
  return {
    name: 'express-plugin',
    configureServer(server) {
      server.middlewares.use(expressApp)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), expressPlugin()],
})

