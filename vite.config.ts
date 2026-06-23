import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [UnoCSS(), sveltekit()],
	resolve: {
		alias: {
			'@oxc-parser/binding-wasm32-wasi': path.resolve(__dirname, 'src/lib/stubs/oxc-wasm32-wasi.ts')
		}
	},
	build: {
		rolldownOptions: {
			external: ['@oxc-parser/binding-wasm32-wasi']
		}
	}
});
