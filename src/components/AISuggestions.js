import React, { useEffect } from 'react';
import { useAISuggestions } from '../hooks/useAISuggestions.js';
import '../styles/AISuggestions.css';

export const AISuggestions = ({ code }) => {
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
      {suggestions.map((suggestion, index) => (
        <div key={index} className="suggestion-card">
          <h4>{suggestion.title}</h4>
          <span className={`category-badge ${suggestion.category}`}>
            {suggestion.category}
          </span>
          <p>{suggestion.description}</p>
          <pre>
            <code>{suggestion.code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}; 