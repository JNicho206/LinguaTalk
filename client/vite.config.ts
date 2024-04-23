import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from "./node_modules/autoprefixer";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "./build"
  }
})
