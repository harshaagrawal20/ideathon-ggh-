import OpenAI from 'openai';

// Helper functions
const extractSection = (text, section) => {
  const pattern = new RegExp(`${section}:[\\s\\S]*?(?=\\n\\n|$)`);
  const match = text.match(pattern);
  return match ? match[0].replace(`${section}:`, '').trim() : '';
};

const parseAnalysisResponse = (analysis) => {
  return {
    errors: extractSection(analysis, 'ERRORS'),
    improvements: extractSection(analysis, 'IMPROVEMENTS'),
    solution: extractSection(analysis, 'EXAMPLE_SOLUTION')
  };
};

const generateAnalysisPrompt = (code, language) => {
  return `As an AI code assistant, analyze this ${language} code and provide:
1. Error detection and fixes
2. Performance improvements
3. Best practices suggestions
4. Code quality improvements

Code to analyze:
${code}

Provide detailed suggestions in this format:
ERRORS:
- Description of each error
- How to fix it
- Example of corrected code

IMPROVEMENTS:
- Performance suggestions
- Best practices
- Code quality tips

EXAMPLE_SOLUTION:
[Provide optimized version of the code]`;
};

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Main export function
const analyzeSuggestions = async (code, language) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer and AI programming assistant. Provide detailed code analysis and improvements."
        },
        {
          role: "user",
          content: generateAnalysisPrompt(code, language)
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const analysis = response.choices[0].message.content;
    const sections = parseAnalysisResponse(analysis);

    return [{
      type: 'analysis',
      issue: 'Code Analysis Results',
      explanation: sections.errors + '\n\n' + sections.improvements,
      code: sections.solution,
      severity: 'info'
    }];

  } catch (error) {
    console.error('Error in analyzeSuggestions:', error);
    return [{
      type: 'error',
      issue: 'Analysis Error',
      explanation: `Failed to analyze code: ${error.message}`,
      code: code
    }];
  }
};

// Add a test function to verify API connection
const testConnection = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a code analysis assistant."
        },
        {
          role: "user",
          content: "Test connection"
        }
      ],
      max_tokens: 50
    });

    return {
      success: true,
      message: "OpenAI connection successful"
    };
  } catch (error) {
    console.error('OpenAI connection error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export all functions
export {
  analyzeSuggestions,
  testConnection
}; 