import React from 'react';

const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="error-display">
      <h3>Error</h3>
      <p>{error.message}</p>
      {error.stack && (
        <pre>
          <code>{error.stack}</code>
        </pre>
      )}
    </div>
  );
};

export default ErrorDisplay; 