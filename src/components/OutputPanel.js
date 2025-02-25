import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // or any other style you prefer

const OutputPanel = ({ output }) => {
  const codeRef = useRef(null);
  const isError = output.includes('Error:') || output.includes('error:');
  
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [output]);

  return (
    <div className="output-panel">
      <h3>Output</h3>
      <div className={`output-content ${isError ? 'has-error' : ''}`}>
        <pre>
          <code 
            ref={codeRef}
            className="javascript"
          >
            {output || '// No output yet. Run your code to see results.'}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default OutputPanel; 