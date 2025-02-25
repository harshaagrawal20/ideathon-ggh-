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
  const completions = {
    python: [
      {
        label: 'print',
        kind: 'Function',
        insertText: 'print(${1:value})',
        insertTextRules: 4, // Use CompletionItemInsertTextRule.InsertAsSnippet
        documentation: 'Print a value to the console',
        detail: 'print(value)',
      },
      {
        label: 'def',
        kind: 'Keyword',
        insertText: 'def ${1:function_name}(${2:parameters}):\n\t${3:pass}',
        insertTextRules: 4,
        documentation: 'Define a new function',
      },
      {
        label: 'if',
        kind: 'Keyword',
        insertText: 'if ${1:condition}:\n\t${2:pass}',
        insertTextRules: 4,
        documentation: 'If statement',
      },
      // Add more Python completions as needed
    ],
    // Add other language completions here
  };

  return completions[language] || [];
}; 
