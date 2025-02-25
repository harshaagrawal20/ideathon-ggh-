import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AICodeEditor from './AICodeEditor';

// Mock the services
jest.mock('../services/aiService');
jest.mock('../services/pistonService');

describe('AICodeEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders editor with default code', () => {
    render(<AICodeEditor />);
    expect(screen.getByText(/Write your code here/)).toBeInTheDocument();
  });

  test('renders language selector', () => {
    render(<AICodeEditor />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
}); 