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

      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-native',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'expo-*',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@expo/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/lib/**',
              group: 'internal',
            },
            {
              pattern: '@/stores/**',
              group: 'internal',
            },
            {
              pattern: '@/components/**',
              group: 'internal',
            },
            {
              pattern: '@/constants/**',
              group: 'internal',
            },
            {
              pattern: '@/assets/**',
              group: 'internal',
            },
          ],
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'sort-imports': [
        'warn',
        {
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],
    },
  },
]);
