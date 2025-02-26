import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';

// Mock the services
jest.mock('./services/aiService');
jest.mock('./services/pistonService');

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>{component}</ThemeProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear localStorage mock
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders code editor', () => {
    renderWithTheme(<App />);
    const editorElement = screen.getByTestId('monaco-editor');
    expect(editorElement).toBeInTheDocument();
  });

  test('renders with default code', () => {
    renderWithTheme(<App />);
    const defaultCode = screen.getByText(/Write your code here/i);
    expect(defaultCode).toBeInTheDocument();
  });
});
