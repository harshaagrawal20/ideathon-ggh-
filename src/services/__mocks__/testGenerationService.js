export const testGenerationService = {
  generateTests: jest.fn().mockResolvedValue({
    testCode: 'test("example", () => { expect(true).toBe(true); });',
    suggestions: ['Add more test cases']
  }),
  analyzeCode: jest.fn()
};

export default testGenerationService; 