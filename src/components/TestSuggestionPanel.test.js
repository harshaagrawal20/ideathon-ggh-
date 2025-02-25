import { render, screen, fireEvent } from '@testing-library/react';
import TestSuggestionPanel from './TestSuggestionPanel';

describe('TestSuggestionPanel', () => {
  const mockCode = 'function add(a, b) { return a + b; }';

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