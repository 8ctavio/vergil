import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],
	test: {
		dir: 'tests',
		environment: 'happy-dom',
		typecheck: {
			enabled: true,
			checker: 'vue-tsc',
			tsconfig: 'tsconfig.test.json'
		}
	}
})