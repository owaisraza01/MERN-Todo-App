import React, { useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button, Divider, Alert, useTheme,
    InputAdornment, IconButton,
} from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
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
        if (password !== confirm) {
            setResult({ type: 'error', message: 'Passwords do not match' });
            return;
        }
        if (password.length < 6) {
            setResult({ type: 'error', message: 'Password must be at least 6 characters' });
            return;
        }
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
                    <LockRoundedIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    <Typography variant="h5" fontWeight={900} color="primary">
                        Reset Password
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Enter your new password below.
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {result && (
                    <Alert severity={result.type} sx={{ mb: 2, borderRadius: 2 }}>
                        {result.message}
                        {result.type === 'success' && ' Redirecting to login...'}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="New Password"
                        type={showPass ? 'text' : 'password'}
                        fullWidth
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
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
                    <TextField
                        label="Confirm Password"
                        type={showPass ? 'text' : 'password'}
                        fullWidth
                        required
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        sx={{ mb: 3 }}
                        InputProps={{ sx: { borderRadius: 2, bgcolor: inputBg } }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading || result?.type === 'success'}
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
                        {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
