import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton, useTheme, Link } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { tokens } from '../theme/theme';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const theme = useTheme();
    const { login } = useAuth();
    const dark = theme.palette.mode === 'dark';

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            login(data.token);
            window.location.href = '/';
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally { setLoading(false); }
    };

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
                {/* Decorative grid */}
                <Box
                    aria-hidden
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                        backgroundSize: '48px 48px',
                        pointerEvents: 'none',
                    }}
                />
                {/* Accent glow */}
                <Box
                    aria-hidden
                    sx={{
                        position: 'absolute',
                        bottom: -180,
                        right: -180,
                        width: 420,
                        height: 420,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(212,255,58,0.18) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

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
                        // SYSTEM ACCESS
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: tokens.fontDisplay,
                            fontWeight: 700,
                            fontSize: { md: 64, lg: 80 },
                            letterSpacing: '-0.04em',
                            lineHeight: 0.95,
                            mb: 3,
                        }}
                    >
                        Operate<br />
                        at the speed<br />
                        of <Box component="span" sx={{ color: tokens.accent }}>thought.</Box>
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 380, lineHeight: 1.6 }}>
                        A precision instrument for teams who treat task management as engineering — not paperwork.
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em' }}>
                        © {new Date().getFullYear()} · v2.0
                    </Typography>
                    <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em' }}>
                        BUILD 240513
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
                    backgroundImage: 'none',
                }}
            >
                <Box sx={{ maxWidth: 360, width: '100%', mx: 'auto' }}>
                    <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: tokens.accent, letterSpacing: '0.18em', mb: 2 }}>
                        ◆ 01 — SIGN IN
                    </Typography>
                    <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 700, fontSize: 36, letterSpacing: '-0.035em', lineHeight: 1, mb: 1 }}>
                        Welcome back<Box component="span" sx={{ color: tokens.accent }}>.</Box>
                    </Typography>
                    <Typography fontSize={13} color="text.secondary" mb={4}>
                        New here?{' '}
                        <Link component="button" onClick={() => nav('/register')} sx={{ fontFamily: tokens.fontMono, fontSize: 12, color: tokens.accent, textDecoration: 'none', borderBottom: `1px solid ${tokens.accent}`, '&:hover': { opacity: 0.7 } }}>
                            Create account →
                        </Link>
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Box mb={2}>
                            <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, fontWeight: 500, color: 'text.secondary', letterSpacing: '0.14em', mb: 1 }}>
                                ◇ EMAIL
                            </Typography>
                            <TextField type="email" fullWidth required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                        </Box>

                        <Box mb={3}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, fontWeight: 500, color: 'text.secondary', letterSpacing: '0.14em' }}>
                                    ◇ PASSWORD
                                </Typography>
                                <Link component="button" type="button" onClick={() => nav('/forgot-password')} sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.secondary', textDecoration: 'none', letterSpacing: '0.06em', '&:hover': { color: tokens.accent } }}>
                                    FORGOT?
                                </Link>
                            </Box>
                            <TextField
                                type={showPass ? 'text' : 'password'}
                                fullWidth required placeholder="••••••••"
                                value={password} onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setShowPass(v => !v)} edge="end" tabIndex={-1} sx={{ color: 'text.disabled' }}>
                                                {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ py: 1.25, fontSize: 13, fontWeight: 700, fontFamily: tokens.fontMono, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                        >
                            {loading ? '· Authenticating ·' : 'Sign In →'}
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
