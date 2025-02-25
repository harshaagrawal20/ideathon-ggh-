import React from 'react';
import { render, screen } from '@testing-library/react';
import OutputPanel from './OutputPanel';

describe('OutputPanel', () => {
  test('renders output content', () => {
    const output = 'Test output';
    render(<OutputPanel output={output} />);
    expect(screen.getByText(output)).toBeInTheDocument();
  });
}); 