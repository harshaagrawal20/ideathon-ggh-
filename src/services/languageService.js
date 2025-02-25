import { pythonSnippets } from './snippets/python';
import { javascriptSnippets } from './snippets/javascript';
import { rubySnippets } from './snippets/ruby';

// Cache completions for better performance
const completionsCache = new Map();

const completions = {
  python: pythonSnippets,
  javascript: javascriptSnippets,
  ruby: rubySnippets
};

export const getLanguageCompletions = (language) => {
  // Add type validation
  if (typeof language !== 'string') {
    throw new TypeError('Language parameter must be a string');
  }

  // Check cache first
  if (completionsCache.has(language)) {
    return completionsCache.get(language);
  }

  // Add supported languages constant
  const SUPPORTED_LANGUAGES = ['python', 'javascript', 'ruby'];
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(`Language '${language}' is not supported. Returning empty completions.`);
  }

  const result = completions[language] || [];
  completionsCache.set(language, result);
  return result;
}; 
