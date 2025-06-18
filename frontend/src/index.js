import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/inter';
import axios from 'axios';

// Use environment variable (works both locally and on Render)
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
console.log(process.env.REACT_APP_API_URL)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);