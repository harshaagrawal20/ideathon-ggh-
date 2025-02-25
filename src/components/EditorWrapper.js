import React from 'react';

const EditorWrapper = ({ children }) => {
  return (
    <div 
      className="editor-wrapper" 
      style={{ 
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default EditorWrapper; 