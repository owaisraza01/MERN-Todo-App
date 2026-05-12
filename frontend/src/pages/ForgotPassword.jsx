import React, { useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button, Divider, Alert, useTheme,
} from '@mui/material';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
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
        setResult(null);
        try {
            const { data } = await axios.post('/api/auth/forgot-password', { email });
            setResult({ type: 'success', message: data.message, resetUrl: data.resetUrl });
        } catch (err) {
            setResult({ type: 'error', message: err.response?.data?.message || 'Failed to send reset link' });
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
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    maxWidth: 440,
                    width: '100%',
                    borderRadius: 4,
                    p: { xs: 3, sm: 5 },
                    background: cardBg,
                    backdropFilter: 'blur(18px)',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 16px 48px 0 rgba(0,0,0,0.5)'
                        : '0 16px 48px 0 rgba(33,147,176,0.15)',
                }}
            >
                <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                    <LockResetRoundedIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    <Typography variant="h5" fontWeight={900} color="primary">
                        Forgot Password
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Enter your email and we'll send you a reset link.
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {result && (
                    <Alert severity={result.type} sx={{ mb: 2, borderRadius: 2 }}>
                        {result.message}
                        {result.resetUrl && (
                            <Box mt={1}>
                                <Typography fontSize={12} fontWeight={700}>Dev mode — copy your reset link:</Typography>
                                <Box
                                    component="a"
                                    href={result.resetUrl}
                                    sx={{ fontSize: 11, wordBreak: 'break-all', color: 'primary.main' }}
                                >
                                    {result.resetUrl}
                                </Box>
                            </Box>
                        )}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        sx={{ mb: 3 }}
                        InputProps={{ sx: { borderRadius: 2, bgcolor: inputBg } }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            py: 1.4,
                            textTransform: 'none',
                            fontSize: 15,
                            background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                            '&:hover': { background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' },
                        }}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => nav('/login')}
                        sx={{ mt: 2, borderRadius: 2, fontWeight: 600, textTransform: 'none', color: 'primary.main' }}
                    >
                        Back to Sign In
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;
