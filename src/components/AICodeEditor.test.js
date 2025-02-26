import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AICodeEditor from './AICodeEditor';
import { ThemeProvider } from '../context/ThemeContext';

// Mock the services
jest.mock('../services/aiService');
jest.mock('../services/pistonService');

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>{component}</ThemeProvider>
  );
};

describe('AICodeEditor', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders editor with default code', () => {
    renderWithTheme(<AICodeEditor />);
    const editorElement = screen.getByTestId('monaco-editor');
    expect(editorElement).toBeInTheDocument();
  });

  test('renders language selector', () => {
    renderWithTheme(<AICodeEditor />);
    const selector = screen.getByRole('combobox', { name: /language/i });
    expect(selector).toBeInTheDocument();
  });

  test('renders run button', () => {
    renderWithTheme(<AICodeEditor />);
    const runButton = screen.getByText(/Run Code/i);
    expect(runButton).toBeInTheDocument();
  });
}); 