import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';  // Real AttributeAI app
// import AppTestSocial from './AppTestSocial';  // Testing social auth - DISABLED

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
