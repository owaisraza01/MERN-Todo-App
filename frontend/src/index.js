import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/inter';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';

axios.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
