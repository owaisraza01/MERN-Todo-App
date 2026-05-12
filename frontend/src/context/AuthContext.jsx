import React, { createContext, useState, useMemo } from 'react';

const AuthContext = createContext(null);

const decodeToken = (token) => {
    if (!token) return null;
    try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const user = useMemo(() => decodeToken(token), [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        window.location.href = '/login';
    };

    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    return (
        <AuthContext.Provider value={{ token, user, login, logout, authHeader }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
