const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  react.configs.recommended,
  typescript.configs.recommended,
  importPlugin.configs.recommended,
  importPlugin.configs.typescript,
  prettier,
  {
    plugins: {
      react,
      '@typescript-eslint': typescript,
      import: importPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      // Add more custom rules here if needed
    },
  },
];