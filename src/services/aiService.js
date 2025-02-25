import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';
import Replicate from 'replicate';

// Explicitly get the API key from environment variables
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

if (!apiKey) {
  console.error('OpenAI API key is missing! Check your .env file.');
}

console.log('API Key available:', !!process.env.REACT_APP_OPENAI_API_KEY);

const _openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true  // Add this for browser-side usage
});

const hf = new HfInference(process.env.REACT_APP_HF_TOKEN);

const _replicate = new Replicate({
  auth: process.env.REACT_APP_REPLICATE_API_TOKEN,
});

// Add rate limiting
let lastCallTimestamp = 0;
const RATE_LIMIT_DELAY = 2000; // 2 seconds between calls

const waitForRateLimit = () => {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTimestamp;
  if (timeSinceLastCall < RATE_LIMIT_DELAY) {
    return new Promise(resolve => 
      setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastCall)
    );
  }
  return Promise.resolve();
};

const generatePrompt = (code, language) => {
  return `As an expert ${language} developer, analyze this code and suggest improvements.
Focus on:
1. Performance optimizations
2. Error handling
3. Best practices
4. Security issues
5. Code readability

For each suggestion, format your response exactly like this:
ISSUE: Brief description of the issue
| EXPLANATION: Detailed explanation of why it's an issue and how to fix it
| CODE: Complete fixed code

Example format:
ISSUE: Missing error handling
| EXPLANATION: The function doesn't handle null inputs, which could cause runtime errors
| CODE: function example(input) { if (!input) throw new Error('Input required'); return input.value; }

Analyze this code:
${code}`;
};

const MOCK_MODE = true; // Enable mock mode while fixing token

// Add mock suggestions
const MOCK_SUGGESTIONS = [
  {
    issue: 'Missing input validation',
    explanation: 'The function should validate inputs to prevent runtime errors',
    code: `const calculateFactorial = (n) => {
  if (typeof n !== 'number' || n < 0) {
    throw new Error('Input must be a non-negative number');
  }
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
};`,
    preview: '🔍 Missing input validation\n\n💡 Add type checking and range validation',
    type: 'error-fix'
  },
  {
    issue: 'Inefficient sorting algorithm',
    explanation: 'Bubble sort has O(n²) complexity. Consider using Array.sort()',
    code: `const sortArray = (arr) => {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
  return [...arr].sort((a, b) => a - b);
};`,
    preview: '🔍 Performance improvement\n\n💡 Use built-in sort method',
    type: 'error-fix'
  }
];

const _GITHUB_COPILOT_URL = 'https://api.githubcopilot.com/suggest';

const OLLAMA_URL = 'http://localhost:11434/api/generate';

// Add a test function
const testHFConnection = async () => {
  try {
    console.log('Testing HF connection...');
    const response = await hf.textGeneration({
      model: 'bigcode/starcoder',
      inputs: 'Write a hello world function',
      parameters: {
        max_new_tokens: 50,
        temperature: 0.7
      }
    });
    console.log('HF Test successful:', response);
    return true;
  } catch (error) {
    console.error('HF Test failed:', error);
    return false;
  }
};

const processSuggestions = (aiResponse) => {
  // Split response into individual suggestions
  return aiResponse.split('ISSUE:')
    .slice(1) // Remove the first empty element
    .map(suggestion => {
      // Extract parts
      const parts = suggestion.split('EXPLANATION:');
      if (parts.length !== 2) return null;

      const issue = parts[0].trim();
      const [explanation, codeSection] = parts[1].split('FIXED CODE:');
      if (!codeSection) return null;

      const code = codeSection.split('END')[0].trim();

      return {
        issue: issue,
        explanation: explanation.trim(),
        code: code,
        preview: `🔍 Error: ${issue}\n\n💡 ${explanation.trim()}\n\nFixed Code:\n${code}`,
        type: 'error-fix'
      };
    })
    .filter(Boolean); // Remove any null results
};

export const analyzeSuggestions = async (code, language) => {
  try {
    if (MOCK_MODE) {
      console.log('Using mock suggestions');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      return MOCK_SUGGESTIONS;
    }

    // Test connection first
    const isConnected = await testHFConnection();
    if (!isConnected) {
      return [{
        issue: 'Authentication Error',
        explanation: 'Failed to authenticate with Hugging Face. Please check your API token.',
        code: code,
        preview: '⚠️ Authentication failed',
        type: 'error'
      }];
    }

    console.log('Starting code analysis with Hugging Face...');
    
    const prompt = `Analyze this ${language} code and suggest improvements:
    Focus on:
    1. Performance
    2. Error handling
    3. Best practices
    4. Security
    5. Readability

    Code to analyze:
    ${code}

    Format each suggestion as:
    ISSUE: [brief description]
    EXPLANATION: [detailed explanation]
    FIXED CODE: [complete fixed code]
    END`;

    const response = await hf.textGeneration({
      model: 'bigcode/starcoder',
      inputs: prompt,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2
      }
    });

    console.log('HF Response:', response);
    return processSuggestions(response.generated_text);

  } catch (error) {
    console.error('Error with Hugging Face API:', error);
    return [{
      issue: 'API Error',
      explanation: `Failed to get suggestions. Error: ${error.message}`,
      code: code,
      preview: '⚠️ Could not generate suggestions',
      type: 'error'
    }];
  }
};

// Language-specific code templates
const codeTemplates = {
  javascript: {
    function: `function functionName(params) {
  // Function implementation
  return result;
}`,
    class: `class ClassName {
  constructor(params) {
    // Initialize
  }

  method() {
    // Method implementation
  }
}`
  },
  python: {
    function: `def function_name(params):
    # Function implementation
    return result`,
    class: `class ClassName:
    def __init__(self, params):
        # Initialize
        pass

    def method(self):
        # Method implementation
        pass`
  },
  // Add more languages as needed
};

// Helper function to get code template
export const getCodeTemplate = (language, type) => {
  return codeTemplates[language]?.[type] || '';
}; 