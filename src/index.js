import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';  // Commented out for testing
import AppTestSocial from './AppTestSocial';  // Testing social auth

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppTestSocial />
  </React.StrictMode>
);