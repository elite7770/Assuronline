// ESLint Flat Config (v9+)
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    ignores: [
      '**/node_modules/**',
      'frontend/build/**',
      'backend/documents/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.vite/**'
    ]
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: { import: pluginImport, react: pluginReact },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'warn'
    }
  },
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {}
  },
  {
    files: ['frontend/src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {}
  }
];
