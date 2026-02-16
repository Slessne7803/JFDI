import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    // This tells Vite to resolve all paths starting from the root
    base: '/', 
    
    plugins: [react()],
    define: {
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        // This makes sure your '@' imports point to the right place
        '@': path.resolve(__dirname, './src'),
      },
    }
});
