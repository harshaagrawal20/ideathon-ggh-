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

export const generateTests = async (code, framework = 'jest') => {
  try {
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid code input');
    }

    if (MOCK_MODE) {
      console.log('Using mock test results');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return MOCK_TEST_RESULTS;
    }

    await waitForTestRateLimit();
    lastTestCallTimestamp = Date.now();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a test automation expert. Generate comprehensive tests with high coverage."
        },
        {
          role: "user",
          content: generateTestPrompt(code, framework)
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = response.choices[0].message.content;
    
    // Extract sections using regex
    const testCode = result.match(/TEST_CODE:\n([\s\S]*?)\nEND_TEST_CODE/)?.[1] || '';
    const coverage = result.match(/COVERAGE:\n([\s\S]*?)\nEND_COVERAGE/)?.[1] || '';
    const suggestions = result.match(/SUGGESTIONS:\n([\s\S]*?)\nEND_SUGGESTIONS/)?.[1] || '';

    // Parse coverage metrics
    const coverageMetrics = {
      lines: parseInt(coverage.match(/Lines: (\d+)/)?.[1] || '0'),
      functions: parseInt(coverage.match(/Functions: (\d+)/)?.[1] || '0'),
      branches: parseInt(coverage.match(/Branches: (\d+)/)?.[1] || '0')
    };

    // Parse suggestions
    const suggestionsList = suggestions
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.startsWith('-'))
      .map(s => s.substring(1).trim());

    return {
      testCode,
      coverage: coverageMetrics,
      suggestions: suggestionsList
    };

  } catch (error) {
    console.error('Error generating tests:', error);
    return {
      testCode: `// Error generating tests: ${error.message}`,
      coverage: { lines: 0, functions: 0, branches: 0 },
      suggestions: ['Failed to generate tests. Please try again.']
    };
  }
}; 