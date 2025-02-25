const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

export const pistonService = {
  async getRuntimes() {
    const response = await fetch(`${PISTON_API_URL}/runtimes`);
    return await response.json();
  },

  async executeCode(language, code, input = '', args = []) {
    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        version: '*', // Latest version
        files: [
          {
            name: `main.${language}`,
            content: code,
          },
        ],
        stdin: input,
        args,
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });
    return await response.json();
  },
}; 