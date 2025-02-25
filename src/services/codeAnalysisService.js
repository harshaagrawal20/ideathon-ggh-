export const analyzeCode = (code) => {
  const issues = [];

  // Performance Analysis
  if (code.includes('for') && code.includes('length')) {
    const lengthCachingIssue = {
      type: 'performance',
      issue: 'Array Length Caching',
      explanation: 'Cache array length outside loop for better performance',
      code: code.replace(
        /for\s*\(.*;\s*.*\.length\s*;.*\)/g,
        match => `const len = array.length;\n${match.replace('.length', ' < len')}`
      ),
      severity: 'info'
    };
    issues.push(lengthCachingIssue);
  }

  // Security Analysis
  const securityPatterns = {
    'eval(': {
      issue: 'Unsafe eval() Usage',
      explanation: 'eval() can execute malicious code. Use safer alternatives.',
      severity: 'critical'
    },
    'innerHTML': {
      issue: 'XSS Vulnerability',
      explanation: 'innerHTML can lead to XSS attacks. Use textContent or sanitize input.',
      severity: 'high'
    }
  };

  Object.entries(securityPatterns).forEach(([pattern, info]) => {
    if (code.includes(pattern)) {
      issues.push({
        type: 'security',
        ...info
      });
    }
  });

  // Code Quality
  const qualityChecks = {
    'var ': {
      issue: 'Legacy Variable Declaration',
      explanation: 'Use const or let instead of var for better scoping',
      severity: 'warning'
    },
    'console.log': {
      issue: 'Debug Code in Production',
      explanation: 'Remove console.log statements before deployment',
      severity: 'info'
    }
  };

  Object.entries(qualityChecks).forEach(([pattern, info]) => {
    if (code.includes(pattern)) {
      issues.push({
        type: 'quality',
        ...info
      });
    }
  });

  // Add language-specific patterns
  const languagePatterns = {
    javascript: {
      // Add more JS-specific patterns
      'async/await': /await\s+(?!Promise)/,
      'promiseChaining': /\.then\(.*\)\.then/,
      'errorHandling': /try\s*{[^}]*}\s*catch\s*\([^)]*\)\s*{[^}]*}/
    },
    python: {
      'typeHints': /def\s+\w+\([^:]*\)\s*->\s*\w+:/,
      'contextManagers': /with\s+.*:/,
      'listComprehension': /\[.*for.*in.*\]/
    }
  };

  // Add more sophisticated analysis
  if (languagePatterns[language]) {
    Object.entries(languagePatterns[language]).forEach(([name, pattern]) => {
      if (!pattern.test(code)) {
        issues.push({
          type: 'suggestion',
          issue: `Consider using ${name}`,
          explanation: `${name} can improve code quality`,
          severity: 'info'
        });
      }
    });
  }

  return issues;
};

export const optimizeCode = (code) => {
  const optimizations = [];
  let optimizedCode = code;

  // Array operations optimization
  if (code.includes('.forEach') || code.includes('.map')) {
    optimizations.push({
      type: 'performance',
      explanation: 'Consider using for...of loops for better performance with large arrays',
      original: code,
      optimized: code.replace(
        /\.forEach\((.*?)\)/g,
        (match, callback) => `for (const item of items) ${callback}(item)`
      )
    });
  }

  // String concatenation optimization
  if (code.match(/['"][^'"]*['"]\s*\+/)) {
    optimizations.push({
      type: 'performance',
      explanation: 'Use template literals for string concatenation',
      original: code,
      optimized: code.replace(
        /(['"])(.*?)\1\s*\+\s*(['"])(.*?)\3/g,
        '`$2$4`'
      )
    });
  }

  return {
    optimizedCode,
    suggestions: optimizations
  };
}; 