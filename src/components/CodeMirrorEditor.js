import React, { useRef } from 'react';
import Editor from "@monaco-editor/react";

const MonacoEditor = ({ 
  code, 
  language, 
  onChange, 
  onSave,
  selectedTheme = 'light',
  readOnly = false 
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure editor
    monaco.editor.defineTheme('custom-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' }
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#2c2c2c',
        'editor.lineHighlightBackground': '#f5f5f5',
        'editorCursor.foreground': '#0078d4',
        'editor.selectionBackground': '#add6ff',
        'editorLineNumber.foreground': '#6e7681',
        'editorLineNumber.activeForeground': '#0078d4'
      }
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });
  };

  return (
    <div className="editor-wrapper">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        language={language}
        value={code}
        theme={selectedTheme === 'light' ? 'custom-light' : 'vs-dark'}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          padding: { top: 10, bottom: 10 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          },
          bracketPairColorization: { enabled: true }
        }}
        loading={<div className="editor-loading">Loading editor...</div>}
      />
    </div>
  );
};

export default MonacoEditor; 