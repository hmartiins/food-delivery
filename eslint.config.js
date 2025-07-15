// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-plugin-prettier');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      // Desabilitar regras que conflitam com Prettier
      'arrow-parens': 'off',
      'object-curly-spacing': 'off',
      quotes: 'off',
      semi: 'off',
      'space-before-function-paren': 'off',
      'comma-dangle': 'off',
      indent: 'off',
      'max-len': 'off',
      'no-trailing-spaces': 'off',
      'eol-last': 'off',
    },
  },
]);
