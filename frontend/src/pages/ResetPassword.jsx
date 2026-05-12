import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link, useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const nav = useNavigate();
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';

    const handleSubmit = async e => {
        e.preventDefault();
        if (password !== confirm) { setResult({ type: 'error', message: 'Passwords do not match' }); return; }
        if (password.length < 6) { setResult({ type: 'error', message: 'Password must be at least 6 characters' }); return; }
        setLoading(true);
        setResult(null);
        try {
            const { data } = await axios.post(`/api/auth/reset-password/${token}`, { password });
            setResult({ type: 'success', message: data.message });
            setTimeout(() => nav('/login'), 2000);
        } catch (err) {
            setResult({ type: 'error', message: err.response?.data?.message || 'Reset failed' });
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
                    New password
                </Typography>
                <Typography fontSize={13} color="text.secondary" mb={3}>
                    Choose a strong password of at least 6 characters.
                </Typography>

                {result && (
                    <Alert severity={result.type} sx={{ mb: 2, borderRadius: 1.5, fontSize: 13 }}>
                        {result.message}{result.type === 'success' && ' Redirecting…'}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    {[
                        { label: 'NEW PASSWORD', value: password, set: setPassword, placeholder: '••••••••' },
                        { label: 'CONFIRM PASSWORD', value: confirm, set: setConfirm, placeholder: '••••••••' },
                    ].map(f => (
                        <Box key={f.label} mb={2}>
                            <Typography fontSize={12} fontWeight={500} color="text.secondary" mb={0.75} letterSpacing="0.02em">
                                {f.label}
                            </Typography>
                            <TextField
                                type="password"
                                fullWidth
                                required
                                placeholder={f.placeholder}
                                value={f.value}
                                onChange={e => f.set(e.target.value)}
                            />
                        </Box>
                    ))}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading || result?.type === 'success'}
                        sx={{ py: 1.1, fontWeight: 600, mt: 0.5 }}
                    >
                        {loading ? 'Resetting…' : 'Reset password'}
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

export default ResetPassword;
