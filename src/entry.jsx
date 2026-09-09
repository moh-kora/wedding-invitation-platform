import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './main.jsx';
import WeddingFinalSections from './WeddingFinalSections.jsx';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Everly: root element not found.');
}

createRoot(root).render(
  <React.StrictMode>
    <App />
    <WeddingFinalSections />
  </React.StrictMode>
);
