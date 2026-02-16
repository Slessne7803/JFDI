import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    // ADD THIS LINE:
    base: '/', 
    
    plugins: [react()],
    define: {
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        // Updated this to point to the current directory safely
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      // This ensures your assets (CSS/JS) are bundled correctly
      assetsDir: 'assets',
    }
});
