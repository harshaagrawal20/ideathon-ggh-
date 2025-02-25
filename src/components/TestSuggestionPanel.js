import React, { useState } from 'react';
import { generateTests } from '../services/testGenerationService';

const TestSuggestionPanel = ({ code }) => {
  const [tests, setTests] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [framework, setFramework] = useState('jest');

  const handleGenerateTests = async () => {
    setIsLoading(true);
    try {
      const result = await generateTests(code, framework);
      setTests(result);
    } catch (error) {
      console.error('Failed to generate tests:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="test-suggestion-panel">
      <div className="panel-header">
        <h3>Test Generation</h3>
        <select 
          value={framework} 
          onChange={(e) => setFramework(e.target.value)}
        >
          <option value="jest">Jest</option>
          <option value="mocha">Mocha</option>
          <option value="pytest">PyTest</option>
        </select>
        <button 
          onClick={handleGenerateTests}
          disabled={isLoading}
        >
          Generate Tests
        </button>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Generating tests...</p>
        </div>
      )}

      {tests && !tests.error && (
        <div className="generated-tests">
          <h4>Generated Tests</h4>
          <pre>{tests.tests}</pre>
          <button onClick={() => {/* Implement test application */}}>
            Apply Tests
          </button>
        </div>
      )}

      {tests?.error && (
        <div className="error-message">
          Error generating tests: {tests.error}
        </div>
      )}
    </div>
  );
};

export default TestSuggestionPanel; 