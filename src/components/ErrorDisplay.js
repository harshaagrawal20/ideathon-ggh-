import React from 'react';

const ErrorDisplay = ({ error }) => {
  return (
    <div className="error-display" data-testid="error-display">
      <h2>Something went wrong</h2>
      <details>
        <summary>Error Details</summary>
        <pre>{error?.message || 'Unknown error'}</pre>
      </details>
    </div>
  );
};

export default ErrorDisplay; 