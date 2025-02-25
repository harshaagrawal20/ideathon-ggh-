export const aiService = {
  generateSuggestions: jest.fn().mockResolvedValue(['Suggestion 1', 'Suggestion 2']),
  analyzeCode: jest.fn().mockResolvedValue({
    quality: 'good',
    suggestions: ['Improve naming']
  }),
  generateTests: jest.fn().mockResolvedValue({
    testCode: 'test("example", () => {})',
    coverage: { lines: 80, functions: 90 }
  })
};

export default aiService; 