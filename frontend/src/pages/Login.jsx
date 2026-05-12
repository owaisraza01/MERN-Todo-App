import React, { useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button,
    InputAdornment, IconButton, Divider, useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import loginArt from '../assests/images/LoginPage.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const theme = useTheme();

    const glassBg = theme.palette.mode === 'dark'
        ? 'linear-gradient(120deg, #232526 0%, #414345 100%)'
        : 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)';
    const cardBg = theme.palette.mode === 'dark'
        ? 'rgba(30, 37, 51, 0.98)'
        : 'rgba(255,255,255,0.95)';
    const inputBg = theme.palette.mode === 'dark' ? 'rgba(44,62,80,0.88)' : '#f8fbff';

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: glassBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                transition: 'background 0.4s',
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    minHeight: { md: 480 },
                    maxWidth: 920,
                    width: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: cardBg,
                    backdropFilter: 'blur(18px)',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 16px 48px 0 rgba(0,0,0,0.5)'
                        : '0 16px 48px 0 rgba(33,147,176,0.15)',
                }}
            >
                <Box
                    sx={{
                        flex: 1.2,
                        background: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)',
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                    }}
                >
                    <img
                        src={loginArt}
                        alt="TaskFlow"
                        style={{ maxWidth: '100%', maxHeight: 340, objectFit: 'contain' }}
                    />
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        p: { xs: 3, sm: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minWidth: 300,
                    }}
                >
                    <Typography variant="h4" fontWeight={900} color="primary" sx={{ letterSpacing: -1.5 }}>
                        Welcome back
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, mt: 0.5 }}>
                        Sign in to TaskFlow
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{ sx: { borderRadius: 2, bgcolor: inputBg } }}
                        />
                        <TextField
                            label="Password"
                            type={showPass ? 'text' : 'password'}
                            fullWidth
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                            InputProps={{
                                sx: { borderRadius: 2, bgcolor: inputBg },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPass(v => !v)} edge="end" tabIndex={-1}>
                                            {showPass ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<LoginIcon />}
                            disabled={loading}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 700,
                                py: 1.4,
                                textTransform: 'none',
                                fontSize: 16,
                                background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                                '&:hover': { background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' },
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <Button
                            fullWidth
                            onClick={() => nav('/forgot-password')}
                            sx={{ mt: 1.5, borderRadius: 2, fontWeight: 600, textTransform: 'none', color: 'text.secondary', fontSize: 13 }}
                        >
                            Forgot password?
                        </Button>
                        <Button
                            fullWidth
                            onClick={() => nav('/register')}
                            sx={{
                                mt: 1,
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: 'none',
                                color: 'primary.main',
                            }}
                        >
                            Don't have an account?{' '}
                            <Box component="span" sx={{ fontWeight: 800, ml: 0.5 }}>Register</Box>
                        </Button>
                    </form>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;
