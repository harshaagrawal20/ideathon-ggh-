export const pistonService = {
  executeCode: jest.fn().mockResolvedValue({
    run: {
      output: 'Test output',
      error: null
    }
  })
};

export default pistonService; 