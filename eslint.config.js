import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import pluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts,tsx,vue}'],
		plugins: {
			js,
			prettier: pluginPrettier,
		},
		extends: [js.configs.recommended],
		rules: {
			...prettierConfig.rules,
			'prettier/prettier': [
				'error',
				{
					trailingComma: 'es5',
					tabWidth: 2,
					useTabs: true,
					semi: true,
					singleQuote: true,
					endOfLine: 'lf',
					printWidth: 120,
				},
			],
		},
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,vue}'],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
	tseslint.configs.recommended,
	pluginVue.configs['flat/essential'],
	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
	{
		rules: {
			'@typescript-eslint/no-unused-vars': 0,
			'@typescript-eslint/no-empty-object-type': 0,
			'@typescript-eslint/no-explicit-any': 0,
			'@typescript-eslint/no-unused-expressions': 0,
			'no-empty': 0,
			'@typescript-eslint/no-this-alias': 0,
		},
	},
	{ ignores: ['node_modules', 'dist', 'public', '.*', 'tsconfig.json', './app.config.ts'] },
]);
