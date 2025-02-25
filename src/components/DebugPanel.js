import React, { useState } from 'react';

const DebugPanel = ({ code }) => {
  const [debugResults, setDebugResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      setDebugResults(data);
    } catch (error) {
      console.error('Debug analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="debug-panel">
      <div className="panel-header">
        <h3>Debug Analysis</h3>
        <button 
          onClick={analyzeCode}
          disabled={isAnalyzing}
        >
          Analyze Code
        </button>
      </div>

      {isAnalyzing && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Analyzing code...</p>
        </div>
      )}

      {debugResults && (
        <div className="debug-results">
          <div className="issues-section">
            <h4>Potential Issues</h4>
            <ul>
              {debugResults.issues.map((issue, index) => (
                <li key={index} className={`issue-item ${issue.severity}`}>
                  <span className="issue-severity">{issue.severity}</span>
                  <span className="issue-message">{issue.message}</span>
                  <code className="issue-location">{issue.location}</code>
                </li>
              ))}
            </ul>
          </div>

          <div className="suggestions-section">
            <h4>Improvements</h4>
            <ul>
              {debugResults.suggestions.map((suggestion, index) => (
                <li key={index} className="suggestion-item">
                  <p>{suggestion.description}</p>
                  {suggestion.code && (
                    <pre className="suggested-code">
                      <code>{suggestion.code}</code>
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="performance-section">
            <h4>Performance Analysis</h4>
            <div className="metrics">
              <div className="metric">
                <label>Time Complexity:</label>
                <span>{debugResults.performance.timeComplexity}</span>
              </div>
              <div className="metric">
                <label>Space Complexity:</label>
                <span>{debugResults.performance.spaceComplexity}</span>
              </div>
              <div className="metric">
                <label>Memory Usage:</label>
                <span>{debugResults.performance.memoryUsage}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel; 