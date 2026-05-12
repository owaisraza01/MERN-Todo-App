import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, Link, useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const theme = useTheme();
    const { login } = useAuth();
    const dark = theme.palette.mode === 'dark';

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/register', form);
            login(data.token);
            toast.success('Welcome to TaskFlow');
            window.location.href = '/';
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: 'name', label: 'FULL NAME', type: 'text', placeholder: 'Your name' },
        { key: 'email', label: 'EMAIL', type: 'email', placeholder: 'you@example.com' },
        { key: 'password', label: 'PASSWORD', type: 'password', placeholder: '••••••••  (min 6 chars)' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
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
                <Typography fontWeight={700} fontSize={17} letterSpacing="-0.02em" color="#fff">
                    TaskFlow
                </Typography>
                <Box>
                    <Typography variant="h2" fontWeight={700} color="#fff" sx={{ lineHeight: 1.15, mb: 2, maxWidth: 380 }}>
                        Join your team.<br />Start shipping.
                    </Typography>
                    <Typography fontSize={15} color="rgba(255,255,255,0.5)" maxWidth={320}>
                        Set up your account in seconds and collaborate with your team from day one.
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
                    <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em" mb={0.5}>
                        Create account
                    </Typography>
                    <Typography fontSize={13} color="text.secondary" mb={4}>
                        Already have one?{' '}
                        <Link
                            component="button"
                            onClick={() => nav('/login')}
                            fontSize={13}
                            fontWeight={500}
                            color="primary.main"
                            underline="hover"
                        >
                            Sign in
                        </Link>
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        {fields.map(f => (
                            <Box key={f.key} mb={2}>
                                <Typography fontSize={12} fontWeight={500} color="text.secondary" mb={0.75} letterSpacing="0.02em">
                                    {f.label}
                                </Typography>
                                <TextField
                                    type={f.type}
                                    fullWidth
                                    required
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                />
                            </Box>
                        ))}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ py: 1.1, fontSize: 14, fontWeight: 600, mt: 1 }}
                        >
                            {loading ? 'Creating account…' : 'Create account'}
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default Register;
