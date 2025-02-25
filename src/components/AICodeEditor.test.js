import React from 'react';
import { render, screen } from '@testing-library/react';
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
    jest.clearAllMocks();
  });

  test('renders editor with default code', () => {
    renderWithTheme(<AICodeEditor />);
    expect(screen.getByText(/Write your code here/)).toBeInTheDocument();
  });

  test('renders language selector', () => {
    renderWithTheme(<AICodeEditor />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
}); 