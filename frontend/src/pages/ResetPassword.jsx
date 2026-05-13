import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { tokens } from '../theme/theme';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const nav = useNavigate();

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
                    ◆ NEW PASSWORD
                </Typography>
                <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 700, fontSize: 32, letterSpacing: '-0.035em', lineHeight: 1, mb: 1 }}>
                    Choose new<Box component="span" sx={{ color: tokens.accent }}>.</Box>
                </Typography>
                <Typography fontSize={13} color="text.secondary" mb={3}>
                    Minimum 6 characters. Mix letters and numbers.
                </Typography>

                {result && (
                    <Alert severity={result.type} sx={{ mb: 2, fontSize: 13, borderRadius: 0, fontFamily: tokens.fontMono }}>
                        {result.message}{result.type === 'success' && ' Redirecting…'}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    {[
                        { label: 'NEW PASSWORD',     value: password, set: setPassword, placeholder: '••••••••' },
                        { label: 'CONFIRM PASSWORD', value: confirm,  set: setConfirm,  placeholder: '••••••••' },
                    ].map(f => (
                        <Box key={f.label} mb={2}>
                            <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.secondary', letterSpacing: '0.14em', mb: 1 }}>
                                ◇ {f.label}
                            </Typography>
                            <TextField type="password" fullWidth required placeholder={f.placeholder} value={f.value} onChange={e => f.set(e.target.value)} />
                        </Box>
                    ))}

                    <Button
                        type="submit" variant="contained" fullWidth disabled={loading || result?.type === 'success'}
                        sx={{ py: 1.25, mt: 1, fontSize: 13, fontWeight: 700, fontFamily: tokens.fontMono, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                    >
                        {loading ? '· Resetting ·' : 'Reset Password →'}
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

export default ResetPassword;
