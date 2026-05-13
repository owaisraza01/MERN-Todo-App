import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { tokens } from '../theme/theme';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const nav = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const { data } = await axios.post('/api/auth/forgot-password', { email });
            setResult({ type: 'success', message: data.message, resetUrl: data.resetUrl });
        } catch (err) {
            setResult({ type: 'error', message: err.response?.data?.message || 'Request failed' });
        } finally { setLoading(false); }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    p: { xs: 3, sm: 5 },
                }}
            >
                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: tokens.accent, letterSpacing: '0.18em', mb: 2 }}>
                    ◆ RECOVERY
                </Typography>
                <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 700, fontSize: 32, letterSpacing: '-0.035em', lineHeight: 1, mb: 1 }}>
                    Reset access<Box component="span" sx={{ color: tokens.accent }}>.</Box>
                </Typography>
                <Typography fontSize={13} color="text.secondary" mb={3}>
                    Enter your email and we'll send a reset link.
                </Typography>

                {result && (
                    <Alert severity={result.type} sx={{ mb: 2, fontSize: 13, borderRadius: 0, fontFamily: tokens.fontMono }}>
                        {result.message}
                        {result.resetUrl && (
                            <Box mt={1}>
                                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', mb: 0.5 }}>
                                    // DEV — RESET LINK
                                </Typography>
                                <Box component="a" href={result.resetUrl} sx={{ fontSize: 11, fontFamily: tokens.fontMono, wordBreak: 'break-all', color: tokens.accent }}>
                                    {result.resetUrl}
                                </Box>
                            </Box>
                        )}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Box mb={2.5}>
                        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.secondary', letterSpacing: '0.14em', mb: 1 }}>
                            ◇ EMAIL
                        </Typography>
                        <TextField type="email" fullWidth required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </Box>
                    <Button
                        type="submit" variant="contained" fullWidth disabled={loading}
                        sx={{ py: 1.25, fontSize: 13, fontWeight: 700, fontFamily: tokens.fontMono, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                    >
                        {loading ? '· Sending ·' : 'Send Reset Link →'}
                    </Button>
                </form>

                <Box mt={3} textAlign="center">
                    <Link component="button" onClick={() => nav('/login')} sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: 'text.secondary', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', '&:hover': { color: tokens.accent } }}>
                        ← Back to sign in
                    </Link>
                </Box>
            </Box>
        </Box>
    );
};

export default ForgotPassword;
