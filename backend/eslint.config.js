import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.js'],
    rules: { 'no-unused-vars': ['error', { ignoreRestSiblings: true }] },
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
])
