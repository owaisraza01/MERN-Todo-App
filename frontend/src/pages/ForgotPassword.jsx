import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const nav = useNavigate();
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const { data } = await axios.post('/api/auth/forgot-password', { email });
            setResult({ type: 'success', message: data.message, resetUrl: data.resetUrl });
        } catch (err) {
            setResult({ type: 'error', message: err.response?.data?.message || 'Request failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 3,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 380,
                    bgcolor: 'background.paper',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}`,
                    borderRadius: 2,
                    p: { xs: 3, sm: 4 },
                }}
            >
                <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em" mb={0.5}>
                    Reset password
                </Typography>
                <Typography fontSize={13} color="text.secondary" mb={3}>
                    Enter your email and we'll send you a reset link.
                </Typography>

                {result && (
                    <Alert severity={result.type} sx={{ mb: 2, borderRadius: 1.5, fontSize: 13 }}>
                        {result.message}
                        {result.resetUrl && (
                            <Box mt={1}>
                                <Typography fontSize={11} fontWeight={600} mb={0.5}>Dev mode — reset link:</Typography>
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
                    <Box mb={2.5}>
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
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ py: 1.1, fontWeight: 600 }}
                    >
                        {loading ? 'Sending…' : 'Send reset link'}
                    </Button>
                </form>

                <Box mt={2.5} textAlign="center">
                    <Link
                        component="button"
                        onClick={() => nav('/login')}
                        fontSize={13}
                        color="text.secondary"
                        underline="hover"
                    >
                        ← Back to sign in
                    </Link>
                </Box>
            </Box>
        </Box>
    );
};

export default ForgotPassword;
