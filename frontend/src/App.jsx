import React, { useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import getTheme from './theme/theme';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

    const theme = useMemo(() => getTheme(mode), [mode]);

    const handleThemeChange = (newMode) => {
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    const isAuth = !!localStorage.getItem('token');

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3500,
                    style: {
                        borderRadius: '10px',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                        fontSize: 14,
                        background: mode === 'dark' ? '#1e2533' : '#fff',
                        color: mode === 'dark' ? '#f0f4f8' : '#1a202c',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    },
                    success: { iconTheme: { primary: '#43e97b', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#e17055', secondary: '#fff' } },
                }}
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/*"
                        element={
                            isAuth
                                ? <Home mode={mode} setMode={handleThemeChange} />
                                : <Navigate to="/login" />
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
