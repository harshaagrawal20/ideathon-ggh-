import { render, screen } from '@testing-library/react';
import AICodeEditor from './AICodeEditor';

describe('AICodeEditor', () => {
  test('renders editor', () => {
    render(<AICodeEditor />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
}); 