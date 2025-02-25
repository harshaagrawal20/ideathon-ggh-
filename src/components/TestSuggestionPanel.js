import React from 'react';

const TestSuggestionPanel = ({ testResults }) => {
  return (
    <div className="test-suggestion-panel">
      <pre>
        <code>{testResults.testCode}</code>
      </pre>
      <div className="coverage-info">
        <div>Line Coverage: {testResults.coverage.lines}%</div>
        <div>Function Coverage: {testResults.coverage.functions}%</div>
        <div>Branch Coverage: {testResults.coverage.branches}%</div>
      </div>
    </div>
  );
};

export default TestSuggestionPanel;
