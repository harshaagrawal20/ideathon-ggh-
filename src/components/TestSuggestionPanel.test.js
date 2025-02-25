import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestSuggestionPanel from './TestSuggestionPanel';

// Mock the service
jest.mock('../services/testGenerationService');

describe('TestSuggestionPanel', () => {
  const mockCode = 'function test() { return true; }';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders panel with title', () => {
    render(<TestSuggestionPanel code={mockCode} />);
    expect(screen.getByText(/Test Suggestions/)).toBeInTheDocument();
  });

  test('renders test generation panel', () => {
    render(<TestSuggestionPanel code={mockCode} />);
    expect(screen.getByText('Test Generation')).toBeInTheDocument();
  });

  test('shows loading state when generating tests', async () => {
    render(<TestSuggestionPanel code={mockCode} />);
    fireEvent.click(screen.getByText('Generate Tests'));
    expect(screen.getByText('Generating tests...')).toBeInTheDocument();
  });
}); 