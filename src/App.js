import React from 'react';
import AICodeEditor from './components/AICodeEditor';
import './styles/AICodeEditor.css';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AICodeEditor />
    </ErrorBoundary>
  );
}

export default App;
