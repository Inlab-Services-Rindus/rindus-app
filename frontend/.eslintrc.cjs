module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-refresh'],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    '@typescript-eslint/no-explicit-any': 'off',
    camelcase: ['error', { properties: 'never' }],
    quotes: ['error', 'single'],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'error',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react-hooks/exhaustive-deps': 'off',
    'no-duplicate-imports': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../*', './*'],
            message: 'Please use alias imports ( @ )',
          },
        ],
      },
    ],
    '@typescript-eslint/no-unused-vars': ['info', { argsIgnorePattern: '^_' }],
    'spaced-comment': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
