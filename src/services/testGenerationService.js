import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Rate limiting
let lastTestCallTimestamp = 0;
const TEST_RATE_LIMIT_DELAY = 3000;

const waitForTestRateLimit = () => {
  const now = Date.now();
  const timeSinceLastCall = now - lastTestCallTimestamp;
  if (timeSinceLastCall < TEST_RATE_LIMIT_DELAY) {
    return new Promise(resolve => 
      setTimeout(resolve, TEST_RATE_LIMIT_DELAY - timeSinceLastCall)
    );
  }
  return Promise.resolve();
};

const generateTestPrompt = (code, framework) => {
  return `Generate comprehensive ${framework} tests for this code. Include:
1. Unit tests for each function
2. Edge cases
3. Error scenarios
4. Input validation

Code to test:
${code}

Respond in this exact format:

TEST_CODE:
[Your test code here]
END_TEST_CODE

COVERAGE:
Lines: [number]
Functions: [number]
Branches: [number]
END_COVERAGE

SUGGESTIONS:
- [suggestion 1]
- [suggestion 2]
END_SUGGESTIONS`;
};

// Add at the top
const MOCK_MODE = true; // Set to false when billing is active

// Add mock test results
const MOCK_TEST_RESULTS = {
  testCode: `describe('calculateFactorial', () => {
  test('calculates factorial correctly', () => {
    expect(calculateFactorial(5)).toBe(120);
    expect(calculateFactorial(0)).toBe(1);
  });

  test('handles invalid inputs', () => {
    expect(() => calculateFactorial(-1)).toThrow();
    expect(() => calculateFactorial('5')).toThrow();
  });
});`,
  coverage: {
    lines: 85,
    functions: 90,
    branches: 75
  },
  suggestions: [
    'Add test for large numbers',
    'Test edge cases',
    'Add performance tests'
  ]
};

export const generateTests = async (code, language) => {
  // Add more comprehensive test generation
  const testPatterns = {
    javascript: {
      unit: 'describe("${functionName}", () => {',
      integration: 'describe("Integration", () => {',
      edge: 'test("Edge cases", () => {'
    }
  };

  // Add test coverage analysis
  const analyzeCoverage = (code) => {
    return {
      lines: calculateLineCoverage(code),
      functions: calculateFunctionCoverage(code),
      branches: calculateBranchCoverage(code)
    };
  };

  return {
    testCode: generateTestCode(code, language),
    coverage: analyzeCoverage(code),
    suggestions: generateTestSuggestions(code)
  };
}; 