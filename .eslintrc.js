module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': ['warn', { 
      'varsIgnorePattern': '^_',
      'argsIgnorePattern': '^_' 
    }],
    'no-template-curly-in-string': 'off', // Allow template strings in snippets
    'no-use-before-define': ['error', {
      'functions': false,
      'classes': true,
      'variables': true
    }]
  }
}; 