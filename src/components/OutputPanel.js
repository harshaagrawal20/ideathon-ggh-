import React from 'react';

const OutputPanel = ({ output }) => {
  return (
    <div className="output-panel">
      <pre className="output-content">
        <code>{output || '// No output yet. Run your code to see results.'}</code>
      </pre>
    </div>
  );
};

export default OutputPanel; 