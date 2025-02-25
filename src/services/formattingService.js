import prettier from 'prettier';
import pythonFormatter from 'python-format';

export const formatCode = async (code, language) => {
  switch(language) {
    case 'javascript':
      return prettier.format(code, {
        parser: 'babel',
        singleQuote: true,
        trailingComma: 'es5'
      });
    case 'python':
      return pythonFormatter.format(code, {
        indent: '    ',
        maxLineLength: 88
      });
    // Add more language formatters
  }
}; 