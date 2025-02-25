import OpenAI from 'openai';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

const generateDebugPrompt = (code, language, error = null) => {
  return {
    role: "system",
    content: `As an expert debugger, analyze this ${language} code for:
1. Syntax errors
2. Logical errors
3. Performance issues
4. Security vulnerabilities
5. Best practices violations

${error ? `The following error was encountered:\n${error}\n` : ''}

Respond in this exact format:

SYNTAX_ISSUES:
- [List each syntax issue]
END_SYNTAX

LOGICAL_ERRORS:
- [List potential logical errors]
END_LOGICAL

PERFORMANCE_ISSUES:
- [List performance bottlenecks]
END_PERFORMANCE

SECURITY_RISKS:
- [List security vulnerabilities]
END_SECURITY

FIXES:
[Provide corrected code with explanations]
END_FIXES

CODE_ANALYSIS:
[Detailed explanation of the issues and recommended solutions]
END_ANALYSIS`
  };
};

export const analyzeCode = async (code, language, error = null) => {
  try {
    if (!code.trim()) {
      return getEmptyDebugResult();
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        generateDebugPrompt(code, language, error),
        {
          role: "user",
          content: code
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return processDebugResponse(response.choices[0].message.content);
  } catch (error) {
    console.error('Debug analysis error:', error);
    return getEmptyDebugResult('Error analyzing code. Please try again.');
  }
};

const processDebugResponse = (aiResponse) => {
  try {
    const sections = {
      syntaxIssues: extractSection(aiResponse, 'SYNTAX_ISSUES'),
      logicalErrors: extractSection(aiResponse, 'LOGICAL_ERRORS'),
      performanceIssues: extractSection(aiResponse, 'PERFORMANCE_ISSUES'),
      securityRisks: extractSection(aiResponse, 'SECURITY_RISKS'),
      fixes: extractSection(aiResponse, 'FIXES'),
      analysis: extractSection(aiResponse, 'CODE_ANALYSIS')
    };

    return {
      syntaxIssues: parseList(sections.syntaxIssues),
      logicalErrors: parseList(sections.logicalErrors),
      performanceIssues: parseList(sections.performanceIssues),
      securityRisks: parseList(sections.securityRisks),
      fixes: sections.fixes,
      analysis: sections.analysis,
      hasIssues: true
    };
  } catch (error) {
    console.error('Error processing debug response:', error);
    return getEmptyDebugResult('Failed to process debug results.');
  }
};

const extractSection = (text, section) => {
  try {
    const pattern = new RegExp(`${section}:\\s*([\\s\\S]*?)\\s*END_${section}`);
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  } catch (error) {
    console.error(`Error extracting ${section}:`, error);
    return '';
  }
};

const parseList = (text) => {
  if (!text) return [];
  
  try {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-'))
      .map(line => line.substring(1).trim())
      .filter(Boolean);
  } catch (error) {
    console.error('Error parsing list:', error);
    return [];
  }
};

const getEmptyDebugResult = (errorMessage = '') => ({
  syntaxIssues: [],
  logicalErrors: [],
  performanceIssues: [],
  securityRisks: [],
  fixes: '',
  analysis: errorMessage || '',
  hasIssues: false
}); 