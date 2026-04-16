import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import daStyle from 'eslint-config-dicodingacademy';

export default defineConfig([
  // 1. rekomendasi dasar JS
  js.configs.recommended,
  // 2. Style Guide Dicoding
  daStyle,
  // 3. Konfigurasi Khusus
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    rules: {
      'camelcase': 'off',
      'linebreak-style': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
      'no-underscore-dangle': 'off',
      'no-trailing-spaces': 'off',
      // 'no-console': 'off',
      'no-unused-vars': ['error', { 'args': 'none', 'caughtErrors': 'none' }],
    },
  },
]);