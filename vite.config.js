import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vuePlugin from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [
        vuePlugin(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        host: 'localhost',
        // HMR websocket the browser connects back to for hot updates.
        hmr: {
            host: 'localhost',
        },
        watch: {
            // Native FS events are unreliable under Laragon/Windows, so poll
            // for changes to guarantee edits trigger a hot update.
            usePolling: true,
            interval: 300,
            ignored: ['**/storage/framework/views/**'],
        },
    },
    resolve: {
        alias: {
            'ziggy-js': path.resolve(__dirname, 'vendor/tightenco/ziggy/dist/index.esm.js'),
            '@': path.resolve(__dirname, 'resources/js'),
        }
    }
});
