import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Suppress ResizeObserver errors (harmless, caused by rapid component resizing)
window.addEventListener('error', (e) => {
  if (e.message.includes('ResizeObserver')) {
    const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay');
    if (resizeObserverErrDiv) {
      resizeObserverErrDiv.style.display = 'none';
    }
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

// Override console.error for ResizeObserver
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('ResizeObserver')) {
    return;
  }
  originalError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);