const API_URL = 'https://emkc.org/api/v2/piston';

export const pistonService = {
  async getRuntimes() {
    const response = await fetch(`${API_URL}/runtimes`);
    return await response.json();
  },

  async executeCode(language, code, stdin = '') {
    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          version: '*',
          files: [
            {
              name: `main.${language}`,
              content: code
            }
          ],
          stdin: stdin,
          compile_timeout: 10000,
          run_timeout: 3000
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to execute code');
      }

      const result = await response.json();
      return {
        run: {
          output: result.run?.stdout || '',
          error: result.run?.stderr || result.compile?.stderr || null
        }
      };
    } catch (error) {
      throw new Error(`Execution failed: ${error.message}`);
    }
  },
}; 