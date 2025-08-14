// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl' // 1. Import the plugin

export default defineConfig({
  plugins: [
    react(), 
    basicSsl() // 2. Add the plugin here
  ],
})