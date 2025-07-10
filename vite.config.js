import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { fileURLToPath } from 'url'

// ✅ إنشاء __dirname يدويًا لأننا نستخدم ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export default defineConfig({
  plugins: [react()],
//
  resolve: {
    alias: {
      '@axiosInstance': path.resolve(__dirname, 'src/axiosInstance.js'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
