export class SentryService {
  constructor() {
    const apiKey = process.env.REACT_APP_SENTRY_AUTH_TOKEN;
    const organization = process.env.REACT_APP_SENTRY_ORG;
    if (!apiKey || !organization) {
      throw new Error('Sentry API token and organization are required');
    }
    this.apiKey = apiKey;
    this.organization = organization;
    this.baseUrl = 'https://sentry.io/api/0';
  }

  async analyzeCode(code) {
    try {
      const response = await fetch(`${this.baseUrl}/organizations/${this.organization}/code-analysis/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: 'javascript'
        })
      });

      if (!response.ok) {
        throw new Error(`Sentry API error: ${response.status}`);
      }

      const data = await response.json();
      return data.issues || [];
    } catch (error) {
      console.error('Sentry analysis failed:', error);
      throw error;
    }
  }
} 