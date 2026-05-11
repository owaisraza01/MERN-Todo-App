import React, { useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button, Divider, useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import registerArt from '../assests/images/RegisterPage.png';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const theme = useTheme();

    const glassBg = theme.palette.mode === 'dark'
        ? 'linear-gradient(120deg, #232526 0%, #414345 100%)'
        : 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)';
    const cardBg = theme.palette.mode === 'dark' ? 'rgba(30, 37, 51, 0.98)' : 'rgba(255,255,255,0.95)';
    const inputBg = theme.palette.mode === 'dark' ? 'rgba(44,62,80,0.88)' : '#f8fbff';

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.password.length < 3) { toast.error('Password must be at least 3 characters'); return; }
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/register', form);
            localStorage.setItem('token', data.token);
            toast.success('Account created!');
            window.location.href = '/';
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Registration failed');
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
                        src={registerArt}
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
                        Create Account
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, mt: 0.5 }}>
                        Join TaskFlow today
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <form onSubmit={handleSubmit}>
                        {[
                            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
                            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
                            { label: 'Password', key: 'password', type: 'password', placeholder: 'Create a password' },
                        ].map(field => (
                            <TextField
                                key={field.key}
                                label={field.label}
                                type={field.type}
                                placeholder={field.placeholder}
                                fullWidth
                                required
                                value={form[field.key]}
                                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                sx={{ mb: 2 }}
                                InputProps={{ sx: { borderRadius: 2, bgcolor: inputBg } }}
                            />
                        ))}
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
                                fontSize: 16,
                                mt: 1,
                                background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                                '&:hover': { background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' },
                            }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </Button>
                        <Button
                            fullWidth
                            onClick={() => nav('/login')}
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: 'none',
                                color: 'primary.main',
                            }}
                        >
                            Already have an account?{' '}
                            <Box component="span" sx={{ fontWeight: 800, ml: 0.5 }}>Sign In</Box>
                        </Button>
                    </form>
                </Box>
            </Paper>
        </Box>
    );
};

export default Register;
