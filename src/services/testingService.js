export class TestingService {
  async runTests(code, language) {
    const frameworks = {
      javascript: 'jest',
      python: 'pytest',
      cpp: 'googletest'
    };

    const response = await fetch('/api/test/run', {
      method: 'POST',
      body: JSON.stringify({
        code,
        language,
        framework: frameworks[language]
      })
    });

    return await response.json();
  }
} 