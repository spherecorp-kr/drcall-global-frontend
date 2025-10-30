import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			// Prettier가 들여쓰기를 처리하므로 ESLint 규칙 비활성화
			indent: 'off',
			// TypeScript any 타입 허용
			'@typescript-eslint/no-explicit-any': 'off',
			// 사용하지 않는 변수 경고만 표시
			'@typescript-eslint/no-unused-vars': 'warn',
			// React Hooks 규칙 경고로 변경
			'react-hooks/rules-of-hooks': 'warn',
			'react-hooks/exhaustive-deps': 'warn',
			// React Refresh 규칙 경고로 변경
			'react-refresh/only-export-components': 'warn',
			// 표현식 사용 허용
			'@typescript-eslint/no-unused-expressions': 'off',
			// 불규칙한 공백 허용
			'no-irregular-whitespace': 'off',
		},
	},
])
