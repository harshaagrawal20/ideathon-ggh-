import React from 'react';
import AICodeEditor from './components/AICodeEditor';
import './styles/AICodeEditor.css';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AICodeEditor />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
