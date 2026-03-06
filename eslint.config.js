export default [
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        globalThis: true
      }
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single']
    }
  }
];