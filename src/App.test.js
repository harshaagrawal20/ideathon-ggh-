import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the services
jest.mock('./services/aiService');
jest.mock('./services/pistonService');

test('renders learn react link', () => {
  render(<App />);
  const editorElement = screen.getByText(/Write your code here/i);
  expect(editorElement).toBeInTheDocument();
});
