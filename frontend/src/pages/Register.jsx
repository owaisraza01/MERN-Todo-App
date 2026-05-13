import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { tokens } from '../theme/theme';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const { login } = useAuth();

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
        } finally { setLoading(false); }
    };

    const fields = [
        { key: 'name',     label: 'FULL NAME', type: 'text',     placeholder: 'Your name' },
        { key: 'email',    label: 'EMAIL',     type: 'email',    placeholder: 'you@example.com' },
        { key: 'password', label: 'PASSWORD',  type: 'password', placeholder: '•••••••• (min 6 chars)' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
            {/* Left brand panel */}
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 6,
                    bgcolor: '#0a0a0d',
                    color: '#fafafa',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRight: `1px solid rgba(255,255,255,0.06)`,
                }}
            >
                <Box aria-hidden sx={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px', pointerEvents: 'none',
                }} />
                <Box aria-hidden sx={{
                    position: 'absolute', top: -180, left: -180,
                    width: 420, height: 420, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212,255,58,0.16) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <Box sx={{ position: 'relative' }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ width: 36, height: 36, border: `1px solid ${tokens.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.accent, fontFamily: tokens.fontMono, fontWeight: 700, fontSize: 14 }}>
                            T/
                        </Box>
                        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                            Task<Box component="span" sx={{ color: tokens.accent }}>Flow</Box>
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: tokens.accent, letterSpacing: '0.2em', mb: 3 }}>
                        // INITIALIZE WORKSPACE
                    </Typography>
                    <Typography sx={{
                        fontFamily: tokens.fontDisplay, fontWeight: 700,
                        fontSize: { md: 64, lg: 80 }, letterSpacing: '-0.04em',
                        lineHeight: 0.95, mb: 3,
                    }}>
                        Build<br />
                        the system<br />
                        you've <Box component="span" sx={{ color: tokens.accent }}>imagined.</Box>
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 380, lineHeight: 1.6 }}>
                        Spin up a workspace, invite your team, and start shipping in under a minute.
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em' }}>
                        © {new Date().getFullYear()} · v2.0
                    </Typography>
                    <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em' }}>
                        FREE FOREVER
                    </Typography>
                </Box>
            </Box>

            {/* Right form panel */}
            <Box
                sx={{
                    flex: { xs: 1, md: '0 0 480px' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    px: { xs: 3, sm: 7 },
                    py: 6,
                    bgcolor: 'background.paper',
                }}
            >
                <Box sx={{ maxWidth: 360, width: '100%', mx: 'auto' }}>
                    <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: tokens.accent, letterSpacing: '0.18em', mb: 2 }}>
                        ◆ 00 — CREATE ACCOUNT
                    </Typography>
                    <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 700, fontSize: 36, letterSpacing: '-0.035em', lineHeight: 1, mb: 1 }}>
                        Get started<Box component="span" sx={{ color: tokens.accent }}>.</Box>
                    </Typography>
                    <Typography fontSize={13} color="text.secondary" mb={4}>
                        Already registered?{' '}
                        <Link component="button" onClick={() => nav('/login')} sx={{ fontFamily: tokens.fontMono, fontSize: 12, color: tokens.accent, textDecoration: 'none', borderBottom: `1px solid ${tokens.accent}`, '&:hover': { opacity: 0.7 } }}>
                            Sign in →
                        </Link>
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        {fields.map(f => (
                            <Box key={f.key} mb={2}>
                                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, fontWeight: 500, color: 'text.secondary', letterSpacing: '0.14em', mb: 1 }}>
                                    ◇ {f.label}
                                </Typography>
                                <TextField
                                    type={f.type}
                                    fullWidth required
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                />
                            </Box>
                        ))}

                        <Button
                            type="submit" variant="contained" fullWidth disabled={loading}
                            sx={{ py: 1.25, mt: 1, fontSize: 13, fontWeight: 700, fontFamily: tokens.fontMono, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                        >
                            {loading ? '· Initializing ·' : 'Create Account →'}
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default Register;
