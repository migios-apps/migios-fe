// @ts-check

import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImports from 'eslint-plugin-unused-imports'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default tseslint.config(
  [
    {
      ignores: [
        '**/build/',
        '**/node_modules/',
        '**/dist/',
        '**/.prettierrc.js',
        '**/.eslintrc.js',
        '**/env.d.ts',
        '**/eslint.config.mjs',
        '**/postcss.config.cjs',
        '**/tailwind.config.cjs',
      ],
    },
    ...fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
        'eslint-config-prettier',
        'plugin:prettier/recommended',
        'plugin:@tanstack/query/recommended'
      )
    ),

    {
      plugins: {
        'react-refresh': reactRefresh,
        'unused-imports': unusedImports,
        // '@tanstack/query': pluginQuery,
      },

      settings: {
        react: { version: 'detect' },

        'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },

        'import/resolver': {
          typescript: {
            project: './tsconfig.eslint.json',
            alwaysTryTypes: true,
          },
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            paths: ['src']
          },
          alias: {
            map: [
              ['@', './src']
            ],
            extensions: ['.js', '.jsx', '.ts', '.tsx']
          }
        },
      },
      rules: {
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
        'react-hooks/rules-of-hooks': 'off',
        'react/react-in-jsx-scope': 'off',
        'import/first': 'warn',
        'import/default': 'off',
        'import/newline-after-import': 'warn',
        'import/no-named-as-default-member': 'off',
        'import/no-duplicates': 'error',
        'import/no-named-as-default': 0,
        'import/namespace': 'off',
        'import/named': 'off',
        'import/no-unresolved': 'off',
        'react/prop-types': 'off',
        'react/jsx-sort-props': [
          'warn',
          {
            callbacksLast: true,
            shorthandFirst: true,
            ignoreCase: true,
            reservedFirst: true,
            noSortAlphabetically: true,
          },
        ],
        'no-trailing-spaces': 'error',
        'prettier/prettier': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        '@tanstack/query/exhaustive-deps': 'error',
        // 'unused-imports/no-unused-vars': [
        //   'warn',
        //   {
        //     vars: 'all',
        //     varsIgnorePattern: '^_',
        //     args: 'after-used',
        //     argsIgnorePattern: '^_',
        //   },
        // ],
      },
    },
  ],
  tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-trailing-spaces': 'error',
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@tanstack/query/exhaustive-deps': 'error',
    },
  },
  {
    files: ['**/*.tsx', '**/*.ts'],
    rules: {
      'no-trailing-spaces': 'error',
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@tanstack/query/exhaustive-deps': 'error',
    },
  }
)
