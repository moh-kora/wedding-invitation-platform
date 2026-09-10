import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './main.jsx';
import WeddingFinalSections from './WeddingFinalSections.jsx';
import './mobile-music.js';
import './jertiq-royal-majesty.css';

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
