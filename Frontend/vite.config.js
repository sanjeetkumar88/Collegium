import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API requests to your backend
      '/users': 'http://localhost:8000', // Proxy all requests starting with "/users" to the backend
      '/api': 'http://localhost:8000', // Proxy all requests starting with "/api" to the backend
    },
  },
});
