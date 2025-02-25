import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorDisplay from './ErrorDisplay';

describe('ErrorDisplay', () => {
  test('renders error message', () => {
    const error = { message: 'Test error' };
    render(<ErrorDisplay error={error} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
}); 