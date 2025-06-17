import React, { useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import getTheme from './theme/theme';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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