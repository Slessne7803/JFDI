import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load all env variables from the current directory
    // The third parameter '' allows loading variables without the VITE_ prefix
    const env = loadEnv(mode, process.cwd(), '');
    
    // Fallback to Vercel's environment variables if local .env is missing
    const apiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      
      // EXTREMELY IMPORTANT: This 'define' block replaces process.env 
      // with the actual key string during the build so the browser can read it.
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
      },

      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
      
      // Ensures that the base path is correct for Vercel deployments
      base: '/',
    };
});
