import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		svgr({
			svgrOptions: {
				exportType: 'default',
			},
			include: '**/*.svg?react',
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@ui': path.resolve(__dirname, './src/components/ui'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@layouts': path.resolve(__dirname, './src/layouts'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@types': path.resolve(__dirname, './src/types'),
			'@store': path.resolve(__dirname, './src/store'),
			'@services': path.resolve(__dirname, './src/services'),
			'@mocks': path.resolve(__dirname, './src/mocks'),
		},
	},
	server: {
		port: 5173,
		strictPort: true,
		allowedHosts: ['nitric-noncorporately-andrea.ngrok-free.dev'],
	},
	build: {
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
			},
			mangle: {
				toplevel: true,
				safari10: true,
			},
			format: {
				comments: false,
			},
		},
	},
});
