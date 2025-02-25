import { useState, useCallback } from 'react';
import { SentryService } from '../services/sentryService.js';

export const useAISuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const sentryService = new SentryService();

  const generateSuggestions = useCallback(async (code) => {
    if (!code.trim()) {
      setError('No code provided');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const issues = await sentryService.analyzeCode(code);
      
      // Convert Sentry issues to suggestions format
      const newSuggestions = issues.map(issue => ({
        title: issue.title,
        description: issue.description || issue.message || '',
        code: issue.codefix || issue.snippet || '',
        category: issue.level === 'error' ? 'security' : 'improvement'
      }));

      setSuggestions(newSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze code');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    suggestions,
    loading,
    error,
    generateSuggestions
  };
}; 