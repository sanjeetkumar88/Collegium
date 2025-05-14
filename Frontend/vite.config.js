import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'https://collegium-k7r6.onrender.com', // Proxy all requests starting with "/api" to the backend
      '/notes': 'https://collegium-k7r6.onrender.com', // Proxy all requests starting with "/api" to the backend
      '/club': 'https://collegium-k7r6.onrender.com', // Proxy all requests starting with "/api" to the backend
      '/devevent': 'https://collegium-k7r6.onrender.com', // Proxy all requests starting with "/api" to the backend
      '/devproject': 'https://collegium-k7r6.onrender.com', // Proxy all requests starting with "/api" to the backend
      '/payment': 'https://collegium-k7r6.onrender.com', // Proxy all requests starting with "/api" to the backend
      '/users': 'https://collegium-k7r6.onrender.com', // Proxy all requests starting with "/api" to the backend
      
    },
  },  
});
