const API_URL = 'https://api.claude.ai/v1/messages';
const API_KEY = process.env.REACT_APP_CLAUDE_API_KEY;

export const aiChatService = {
  async sendMessage(message, context = '') {
    try {
      if (!API_KEY) {
        throw new Error('Claude API key is not configured in environment variables');
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-2.1',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful coding assistant. Provide clear, concise answers about programming.'
            },
            {
              role: 'system',
              content: 'When providing code examples, wrap them in ```language code``` blocks.'
            },
            {
              role: 'user',
              content: `${context}\n\n${message}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get AI response');
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('AI Chat Error:', error);
      if (error.message.includes('API key')) {
        throw new Error('AI service is not properly configured. Please check API settings.');
      }
      if (error.message.includes('429')) {
        throw new Error('Too many requests. Please wait a moment before trying again.');
      }
      throw error;
    }
  }
}; 