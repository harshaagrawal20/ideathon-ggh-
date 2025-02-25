import React, { useEffect } from 'react';
import { useAISuggestions } from '../hooks/useAISuggestions';
import '../styles/AISuggestions.css';

interface Suggestion {
  title: string;
  description: string;
  code: string;
  category: 'improvement' | 'bug' | 'performance' | 'security';
}

interface Props {
  code: string;
  onApply: (suggestion: string) => void;
}

export const AISuggestions = ({ code, onApply }: Props) => {
  const { suggestions, loading, error, generateSuggestions } = useAISuggestions();

  useEffect(() => {
    if (code) {
      generateSuggestions(code);
    }
  }, [code, generateSuggestions]);

  if (loading) {
    return <div className="ai-suggestions-loading">Analyzing code...</div>;
  }

  if (error) {
    return <div className="ai-suggestions-error">Error: {error}</div>;
  }

  return (
    <div className="ai-suggestions">
      <h3>💡 AI Suggestions</h3>
      {(suggestions as Suggestion[]).map((suggestion, index) => (
        <div key={index} className="suggestion-card">
          <h4>{suggestion.title}</h4>
          <span className={`category-badge ${suggestion.category}`}>
            {suggestion.category}
          </span>
          <p>{suggestion.description}</p>
          <pre>
            <code>{suggestion.code}</code>
          </pre>
          <div className="suggestion-actions">
            <button onClick={() => onApply(suggestion.code)}>Apply</button>
            <button onClick={() => window.confirm('Are you sure you want to modify this suggestion?')}>
              Modify
            </button>
            <button onClick={() => window.confirm('Reject this suggestion?')}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 