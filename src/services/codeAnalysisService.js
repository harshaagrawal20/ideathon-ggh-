import * as monaco from 'monaco-editor';

// Language-specific error patterns
const errorPatterns = {
  python: {
    syntax: [
      { pattern: /^[^#\n]*[^:]\s*def\s+\w+\s*\([^)]*\)\s*[^\n:]*$/, 
        message: "Missing ':' after function definition",
        fix: "Add ':' at the end of the function definition" },
      { pattern: /^(\s+)[^\n]+\n(\s+)/, 
        indentMismatch: true, 
        message: "Inconsistent indentation",
        fix: "Use consistent indentation (4 spaces recommended)" },
      { pattern: /print [^(]/, 
        message: "Use print() function syntax",
        fix: "Change to print() function syntax for Python 3 compatibility" },
      { pattern: /^\s*return\s+[^{[\s].*,.*[^}\]]$/, 
        message: "Multiple return values should use tuple parentheses",
        fix: "Add parentheses around multiple return values" }
    ],
    logical: [
      { pattern: /while\s*True\s*:(?![^{]*break)/, 
        message: "Infinite loop detected - missing break condition",
        fix: "Add a break condition or return statement" },
      { pattern: /except\s*:/, 
        message: "Avoid bare 'except' clause - specify exception types",
        fix: "Specify the exception type(s) to catch" },
      { pattern: /if\s+[^:]+\s*=\s*[^=]/, 
        message: "Assignment in if condition - possible error",
        fix: "Use == for comparison instead of = for assignment" },
      { pattern: /^\s*assert\s+(?!False).*$/, 
        message: "Assert statement without error message",
        fix: "Add an error message to the assert statement" }
    ],
    performance: [
      { pattern: /for\s+\w+\s+in\s+range\(len\(([^)]+)\)\)/, 
        message: "Use enumerate() instead of range(len())",
        fix: "Replace with 'for i, item in enumerate(list)'" },
      { pattern: /\+\s*=\s*['"]/, 
        message: "Use list.append() for string concatenation in loops",
        fix: "Use a list comprehension or join() method" },
      { pattern: /^\s*(?:if|while).*(?:and|or).*(?:and|or)/, 
        message: "Complex boolean expression - consider splitting",
        fix: "Split into multiple conditions for better readability" }
    ]
  },

  cpp: {
    syntax: [
      { pattern: /delete\s+\w+\s*[^[;]/, 
        message: "Missing semicolon after delete",
        fix: "Add semicolon after delete statement" },
      { pattern: /for\s*\([^;]*;[^;]*;[^)]*\)\s*;/, 
        message: "Unnecessary semicolon after for loop",
        fix: "Remove semicolon after for loop parentheses" },
      { pattern: /^\s*catch\s*\([^)]*\)\s*\w+/, 
        message: "Catch block should use reference parameter",
        fix: "Add & to catch parameter" },
      { pattern: /\b(?:malloc|free)\b/, 
        message: "C-style memory management in C++",
        fix: "Use new/delete or smart pointers instead" }
    ],
    logical: [
      { pattern: /if\s*\([^)]*=[^=][^)]*\)/, 
        message: "Assignment in if condition",
        fix: "Use == for comparison instead of = for assignment" },
      { pattern: /delete\s+\w+\s*;\s*\w+\s*=\s*nullptr\s*;/, 
        message: "Potential use after delete",
        fix: "Set pointer to nullptr before delete" },
      { pattern: /while\s*\([^)]*\)\s*\{\s*\}/, 
        message: "Empty while loop - potential infinite loop",
        fix: "Add loop body or use appropriate control flow" }
    ],
    performance: [
      { pattern: /for\s*\([^)]*\)\s*\{\s*push_back/, 
        message: "Vector size not reserved before loop",
        fix: "Call reserve() before pushing elements in a loop" },
      { pattern: /(?<!&)\b(?:string|vector)<[^>]*>\s+\w+\s*\(/, 
        message: "Large object passed by value",
        fix: "Pass by const reference instead" },
      { pattern: /\+\s*=\s*string/, 
        message: "Inefficient string concatenation",
        fix: "Use string::append() or stringstream" }
    ]
  },

  javascript: {
    syntax: [
      { pattern: /=[^=><](?!=)/, 
        message: "Did you mean '==' for comparison?",
        fix: "Use == for comparison, = is for assignment" },
      { pattern: /console\.log\([^)]*\);?\s*(?:return|throw|break|continue)/, 
        message: "Console.log before control flow statement",
        fix: "Consider moving console.log after the control flow statement" },
      { pattern: /(?<!\.)\b(var|const|let)\s+\w+(?!\s*=)/, 
        message: "Variable declared without initialization",
        fix: "Initialize variable with a value" }
    ],
    logical: [
      { pattern: /===\s*null/, 
        message: "Consider using '=== undefined' or optional chaining",
        fix: "Use optional chaining (?.) or nullish coalescing (??)" },
      { pattern: /(?<!\.)\bmap\((?![^)]*=>\s*{)/, 
        message: "Arrow function missing return statement",
        fix: "Add explicit return or use parentheses for implicit return" },
      { pattern: /if\s*\([^)]*=[^=][^)]*\)/, 
        message: "Assignment in if condition",
        fix: "Use == or === for comparison" },
      { pattern: /setTimeout\s*\(\s*function\s*\(\s*\)\s*{\s*[^}]+}\s*,\s*0\s*\)/, 
        message: "setTimeout with 0 delay",
        fix: "Consider using setImmediate or Promise.resolve()" }
    ],
    performance: [
      { pattern: /\.(map|filter|reduce)\([^)]*\)\.(map|filter|reduce)/, 
        message: "Multiple array operations can be combined",
        fix: "Combine operations into a single method chain" },
      { pattern: /setState\([^)]*\);\s*setState/, 
        message: "Multiple setState calls can be batched",
        fix: "Combine setState calls or use functional updates" },
      { pattern: /\+\s*=\s*['"]/, 
        message: "String concatenation in loop",
        fix: "Use array join() or template literals" }
    ]
  },

  typescript: {
    syntax: [
      { 
        pattern: /(?:interface|type)\s+\w+\s*[^{]*\{[^}]*[^;]\s*}/, 
        message: "Missing semicolons in interface/type definitions",
        fix: "Add semicolons after each property definition" 
      },
      { 
        pattern: /:\s*any\b/, 
        message: "Avoid using 'any' type",
        fix: "Specify a more precise type or use 'unknown' if type is truly unknown" 
      }
    ],
    logical: [
      { 
        pattern: /as\s+any\b/, 
        message: "Unsafe type assertion",
        fix: "Use type guards or proper type assertions" 
      }
    ]
  }
};

// Add security patterns
const securityPatterns = {
  javascript: {
    security: [
      { 
        pattern: /eval\s*\(/, 
        message: "Dangerous use of eval()",
        fix: "Avoid using eval(), use safer alternatives" 
      },
      { 
        pattern: /innerHTML\s*=/, 
        message: "XSS vulnerability risk",
        fix: "Use textContent or sanitize HTML content" 
      }
    ]
  },
  python: {
    security: [
      { 
        pattern: /subprocess\.call\s*\(.*shell\s*=\s*True/, 
        message: "Command injection vulnerability",
        fix: "Avoid shell=True, use array of arguments instead" 
      }
    ]
  }
};

// Severity levels for different types of issues
const severityLevels = {
  syntax: monaco.MarkerSeverity.Error,
  logical: monaco.MarkerSeverity.Warning,
  performance: monaco.MarkerSeverity.Hint
};

export const analyzeCode = (code, language, editor) => {
  if (!code || !language) return [];

  const markers = [];
  const patterns = errorPatterns[language] || {};

  // Check each type of issue
  Object.entries(patterns).forEach(([type, rules]) => {
    rules.forEach(rule => {
      let match;
      let lineNumber = 0;
      const lines = code.split('\n');

      lines.forEach((line, index) => {
        if (rule.indentMismatch && index > 0) {
          const currentIndent = line.match(/^\s*/)[0].length;
          const prevIndent = lines[index - 1].match(/^\s*/)[0].length;
          if (Math.abs(currentIndent - prevIndent) % 4 !== 0) {
            markers.push({
              severity: severityLevels[type],
              message: rule.message,
              startLineNumber: index + 1,
              startColumn: 1,
              endLineNumber: index + 1,
              endColumn: line.length + 1,
              fix: rule.fix
            });
          }
        } else if (rule.pattern.test(line)) {
          markers.push({
            severity: severityLevels[type],
            message: rule.message,
            startLineNumber: index + 1,
            startColumn: 1,
            endLineNumber: index + 1,
            endColumn: line.length + 1,
            fix: rule.fix
          });
        }
      });
    });
  });

  // Set markers in editor
  monaco.editor.setModelMarkers(editor.getModel(), 'codeAnalysis', markers);

  return markers;
};

export const getSuggestions = (markers) => {
  return markers.map(marker => ({
    type: marker.severity === severityLevels.syntax ? 'error' :
          marker.severity === severityLevels.logical ? 'warning' : 'hint',
    message: marker.message,
    line: marker.startLineNumber,
    fix: marker.fix || "Review the highlighted code"
  }));
}; 