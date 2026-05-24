import js from '@eslint/js'
import globals from 'globals'
import sonarjs from 'eslint-plugin-sonarjs'
import tseslint from 'typescript-eslint'

const ignoredPaths = [
	'coverage/**',
	'dist/**',
	'node_modules/**',
	'playwright-report/**',
	'test-results/**',
	'e2e/visual.spec.ts-snapshots/**',
]

const sonarRules = {
	'sonarjs/cognitive-complexity': ['error', 15],
	'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
	'sonarjs/no-identical-functions': 'error',
	'sonarjs/no-nested-conditional': 'warn',
}

export default tseslint.config(
	{
		ignores: ignoredPaths,
	},
	{
		files: ['**/*.{js,mjs,cjs}'],
		extends: [js.configs.recommended, sonarjs.configs.recommended],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
			},
		},
		rules: sonarRules,
	},
	{
		files: ['**/*.{ts,tsx}'],
		extends: [...tseslint.configs.recommended, sonarjs.configs.recommended],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			...sonarRules,
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
				},
			],
		},
	},
	{
		files: ['src/**/*.test.{ts,tsx}', 'e2e/**/*.ts'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.vitest,
			},
		},
	}
)
