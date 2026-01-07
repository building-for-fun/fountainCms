import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: './src/__tests__/setup.ts',
        globals: true
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                changeOrigin: true,
                secure: false,
            },
        },
        // Ensure SPA routing works in dev mode
        strictPort: false,
    },
    preview: {
        port: 5173,
        // Ensure SPA routing works in preview mode
        strictPort: false,
    },
    // Build configuration for production
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
})
