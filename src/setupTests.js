// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
});

// Mock OpenAI API
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mocked AI Response' } }]
        })
      }
    }
  }))
}));

// Mock environment variables
process.env.REACT_APP_OPENAI_API_KEY = 'test-api-key';
process.env.REACT_APP_GITHUB_TOKEN = 'test-github-token';

// Add this to test the UI with sample data
window.sampleTestResults = {
  testCode: `
describe('calculateTotal', () => {
  test('should calculate total with no discount', () => {
    expect(calculateTotal([10, 20, 30])).toBe(60);
  });
});`,
  coverage: {
    lines: 85,
    functions: 90,
    branches: 75
  },
  suggestions: [
    'Add test for empty array input',
    'Test negative numbers handling',
    'Verify discount calculations'
  ]
};
