import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Divider,
    useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginArt from '../assests/images/LoginPage.png'; // Fixed typo: assets

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const theme = useTheme();

    // Theme-adaptive backgrounds and input
    const glassBg =
        theme.palette.mode === 'dark'
            ? 'linear-gradient(120deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)';
    const cardBg =
        theme.palette.mode === 'dark'
            ? 'rgba(34, 40, 49, 0.98)'
            : 'rgba(255,255,255,0.92)';
    const inputBg =
        theme.palette.mode === 'dark'
            ? 'rgba(44,62,80,0.88)'
            : '#f8fbff';

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        } catch (e) {
            alert(e.response?.data?.msg || "Login failed");
        }
        setLoading(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: glassBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, "Roboto", Arial, sans-serif',
                transition: 'background 0.4s',
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    minHeight: { md: 480 },
                    maxWidth: 950,
                    width: '100%',
                    borderRadius: 7,
                    overflow: 'hidden',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 10px 40px 0 #000b'
                        : '0 10px 40px 0 rgba(33,147,176,0.15)',
                    background: cardBg,
                    backdropFilter: 'blur(18px)',
                    transition: 'background 0.4s, box-shadow 0.3s',
                }}
            >
                {/* Left side: Illustration */}
                <Box
                    sx={{
                        flex: 1.2,
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(120deg, #232526 0%, #2193b0 100%)'
                            : 'linear-gradient(120deg, #6dd5ed 0%, #2193b0 100%)',
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        transition: 'background 0.4s',
                    }}
                >
                    <img
                        src={loginArt}
                        alt="Illustration"
                        style={{
                            maxWidth: '100%',
                            maxHeight: 340,
                            borderRadius: 22,
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 6px 32px 0 #0007'
                                : '0 6px 32px 0 rgba(33,147,176,0.14)',
                            objectFit: 'contain',
                        }}
                    />
                </Box>
                {/* Right side: Login form */}
                <Box
                    sx={{
                        flex: 1,
                        p: { xs: 3, sm: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minWidth: 320,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={900}
                        color="primary"
                        sx={{
                            mb: 0.5,
                            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                            letterSpacing: -2,
                            textShadow: theme.palette.mode === 'dark'
                                ? '0 1px 0 #00000060'
                                : '0 1px 0 #ffffff60',
                        }}
                    >
                        Sign in
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ fontSize: 17, mb: 2.5, fontWeight: 500 }}
                    >
                        to your Master Motors Todo Dashboard
                    </Typography>
                    <Divider sx={{ mb: 3, borderColor: theme.palette.mode === 'dark' ? '#2193b044' : undefined }} />
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            placeholder="e.g. john@company.com"
                            type="email"
                            fullWidth
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    borderRadius: 3,
                                    fontSize: 16,
                                    bgcolor: inputBg,
                                    color: theme.palette.text.primary,
                                    '&::placeholder': { color: theme.palette.text.secondary, opacity: 1 },
                                },
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: theme.palette.text.primary,
                                    fontWeight: 600,
                                    fontSize: 15,
                                    opacity: 1,
                                    '&.Mui-focused': {
                                        color: theme.palette.primary.main,
                                        fontWeight: 700,
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Password"
                            placeholder="Enter your password"
                            type={showPass ? 'text' : 'password'}
                            fullWidth
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    borderRadius: 3,
                                    fontSize: 16,
                                    bgcolor: inputBg,
                                    color: theme.palette.text.primary,
                                    '&::placeholder': { color: theme.palette.text.secondary, opacity: 1 },
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPass(v => !v)}
                                            edge="end"
                                            aria-label={showPass ? "Hide password" : "Show password"}
                                            tabIndex={-1}
                                            size="large"
                                        >
                                            {showPass ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: theme.palette.text.primary,
                                    fontWeight: 600,
                                    fontSize: 15,
                                    opacity: 1,
                                    '&.Mui-focused': {
                                        color: theme.palette.primary.main,
                                        fontWeight: 700,
                                    },
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<LoginIcon />}
                            sx={{
                                mt: 1,
                                borderRadius: 3,
                                fontSize: 17,
                                fontWeight: 700,
                                py: 1.3,
                                background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 2px 8px #0006'
                                    : '0 2px 8px 0 #2193b022',
                                textTransform: 'none',
                                transition: 'background 0.3s',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)',
                                },
                            }}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                        <Button
                            fullWidth
                            color="secondary"
                            onClick={() => nav('/register')}
                            sx={{
                                mt: 2,
                                borderRadius: 3,
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: 15,
                                py: 1.1,
                                background: theme.palette.mode === 'dark'
                                    ? 'rgba(142,197,252,0.11)'
                                    : 'rgba(142,197,252,0.09)',
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    background: theme.palette.mode === 'dark'
                                        ? 'rgba(142,197,252,0.20)'
                                        : 'rgba(142,197,252,0.17)',
                                    color: '#1976d2',
                                },
                            }}
                        >
                            Need an account? <span style={{ marginLeft: 5, color: '#1976d2' }}>Register</span>
                        </Button>
                    </form>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;