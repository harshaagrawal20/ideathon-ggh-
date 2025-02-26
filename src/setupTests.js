// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import React from 'react';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock MonacoEditor
jest.mock('@monaco-editor/react', () => {
  return function MockMonacoEditor(props) {
    return (
      <div data-testid="monaco-editor">
        <pre>{props.value || '// Write your code here'}</pre>
      </div>
    );
  };
});

// Mock browser APIs
global.TransformStream = class TransformStream {};
global.TextDecoderStream = class TextDecoderStream {};
global.TextEncoderStream = class TextEncoderStream {};

// Mock OpenAI
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Test response' } }]
        })
      }
    }
  }))
}));

// Mock environment variables
process.env.REACT_APP_OPENAI_API_KEY = 'test-key';
process.env.REACT_APP_PISTON_API_URL = 'http://localhost:2000';
