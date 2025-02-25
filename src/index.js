import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Suppress ResizeObserver loop error more effectively
window.addEventListener('error', (e) => {
  if (e.message.includes('ResizeObserver') || e.message.includes('loop limit exceeded')) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
});

// Also add this to handle the specific loop error
const observer = new ResizeObserver(entries => {
  window.requestAnimationFrame(() => {
    if (!Array.isArray(entries) || !entries.length) {
      return;
    }
  });
});

// Disconnect on unmount
window.addEventListener('beforeunload', () => {
  observer.disconnect();
});
