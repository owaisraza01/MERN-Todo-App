import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, InputAdornment,
    IconButton, Divider, useTheme, Link,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const theme = useTheme();
    const { login } = useAuth();
    const dark = theme.palette.mode === 'dark';

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            login(data.token);
            window.location.href = '/';
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                bgcolor: 'background.default',
            }}
        >
            {/* Left panel */}
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 5,
                    background: dark
                        ? 'linear-gradient(160deg, #0d1424 0%, #070c18 100%)'
                        : 'linear-gradient(160deg, #1e1b4b 0%, #312e81 100%)',
                    borderRight: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)'}`,
                }}
            >
                <Box>
                    <Typography
                        fontWeight={700}
                        fontSize={17}
                        letterSpacing="-0.02em"
                        color="#fff"
                    >
                        TaskFlow
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        variant="h2"
                        fontWeight={700}
                        color="#fff"
                        sx={{ lineHeight: 1.15, mb: 2, maxWidth: 380 }}
                    >
                        Manage tasks.<br />
                        Ship faster.
                    </Typography>
                    <Typography fontSize={15} color="rgba(255,255,255,0.5)" maxWidth={320}>
                        A modern workspace for teams who care about clarity, speed, and execution.
                    </Typography>
                </Box>
                <Typography fontSize={12} color="rgba(255,255,255,0.25)">
                    © {new Date().getFullYear()} TaskFlow
                </Typography>
            </Box>

            {/* Right panel */}
            <Box
                sx={{
                    flex: { xs: 1, md: '0 0 420px' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    px: { xs: 3, sm: 6 },
                    py: 6,
                    bgcolor: 'background.paper',
                }}
            >
                <Box sx={{ maxWidth: 340, width: '100%', mx: 'auto' }}>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        letterSpacing="-0.02em"
                        mb={0.5}
                    >
                        Sign in
                    </Typography>
                    <Typography fontSize={13} color="text.secondary" mb={4}>
                        Don't have an account?{' '}
                        <Link
                            component="button"
                            onClick={() => nav('/register')}
                            fontSize={13}
                            fontWeight={500}
                            color="primary.main"
                            underline="hover"
                        >
                            Create one
                        </Link>
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Box mb={2}>
                            <Typography fontSize={12} fontWeight={500} color="text.secondary" mb={0.75} letterSpacing="0.02em">
                                EMAIL
                            </Typography>
                            <TextField
                                type="email"
                                fullWidth
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </Box>

                        <Box mb={3}>
                            <Box display="flex" justifyContent="space-between" mb={0.75}>
                                <Typography fontSize={12} fontWeight={500} color="text.secondary" letterSpacing="0.02em">
                                    PASSWORD
                                </Typography>
                                <Link
                                    component="button"
                                    type="button"
                                    onClick={() => nav('/forgot-password')}
                                    fontSize={12}
                                    color="text.secondary"
                                    underline="hover"
                                >
                                    Forgot password?
                                </Link>
                            </Box>
                            <TextField
                                type={showPass ? 'text' : 'password'}
                                fullWidth
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => setShowPass(v => !v)}
                                                edge="end"
                                                tabIndex={-1}
                                                sx={{ color: 'text.disabled' }}
                                            >
                                                {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ py: 1.1, fontSize: 14, fontWeight: 600 }}
                        >
                            {loading ? 'Signing in…' : 'Sign in'}
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
