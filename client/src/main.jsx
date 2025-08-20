import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Attach React App to #root in index.html
createRoot(document.getElementById('root')).render(<App />);