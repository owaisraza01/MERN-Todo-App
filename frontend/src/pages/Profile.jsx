import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, InputAdornment, IconButton, useTheme, Stack,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/layout/PageHeader';
import { tokens } from '../theme/theme';

const Section = ({ tag, title, children }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    return (
        <Box
            sx={{
                border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,10,13,0.08)'}`,
                bgcolor: 'background.paper',
                p: 3,
                mb: 2,
            }}
        >
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Box sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: tokens.accent, letterSpacing: '0.1em', fontWeight: 600 }}>
                    {tag}
                </Box>
                <Box sx={{ height: 1, width: 16, bgcolor: 'divider' }} />
                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'text.secondary' }}>
                    {title}
                </Typography>
            </Box>
            {children}
        </Box>
    );
};

const Profile = () => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const { user: tokenUser, authHeader } = useAuth();

    const [name, setName] = useState(tokenUser?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const handleSaveProfile = async e => {
        e.preventDefault();
        if (!name.trim()) return;
        setSavingProfile(true);
        try {
            await axios.put('/api/users/profile', { name }, { headers: authHeader });
            toast.success('Profile updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally { setSavingProfile(false); }
    };

    const handleChangePassword = async e => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
        if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setSavingPassword(true);
        try {
            await axios.put('/api/users/profile', { currentPassword, newPassword }, { headers: authHeader });
            toast.success('Password changed');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally { setSavingPassword(false); }
    };

    const initials = (name || tokenUser?.email || 'U')[0].toUpperCase();
    const isAdmin = tokenUser?.role === 'admin';

    return (
        <>
            <PageHeader
                index="04"
                title="Profile"
                subtitle="Manage your identity, credentials, and role within the workspace."
            />

            <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 }, maxWidth: 720 }}>
                {/* Identity panel */}
                <Box
                    sx={{
                        border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,10,13,0.08)'}`,
                        bgcolor: 'background.paper',
                        p: 3,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                    }}
                >
                    <Box
                        sx={{
                            width: 72,
                            height: 72,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${tokens.accent}`,
                            color: tokens.accent,
                            fontFamily: tokens.fontDisplay,
                            fontSize: 32,
                            fontWeight: 700,
                            flexShrink: 0,
                        }}
                    >
                        {initials}
                    </Box>
                    <Box flex={1} minWidth={0}>
                        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.secondary', letterSpacing: '0.12em', mb: 0.5 }}>
                            // ACCOUNT
                        </Typography>
                        <Typography sx={{ fontFamily: tokens.fontDisplay, fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05 }} noWrap>
                            {tokenUser?.name || 'User'}
                        </Typography>
                        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 12, color: 'text.secondary', mt: 0.25 }} noWrap>
                            {tokenUser?.email}
                        </Typography>
                        <Box
                            sx={{
                                mt: 1.5, display: 'inline-flex',
                                px: 0.875, py: 0.25,
                                border: `1px solid ${isAdmin ? '#f43f5e' : tokens.accent}`,
                                color: isAdmin ? '#f43f5e' : tokens.accent,
                                fontFamily: tokens.fontMono,
                                fontSize: 10,
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {tokenUser?.role || 'user'}
                        </Box>
                    </Box>
                </Box>

                {/* Edit info */}
                <Section tag="◇" title="Profile Info">
                    <form onSubmit={handleSaveProfile}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
                            <TextField label="Display Name" value={name} onChange={e => setName(e.target.value)} size="small" sx={{ flex: 1 }} />
                            <TextField label="Email" value={tokenUser?.email || ''} size="small" disabled sx={{ flex: 1 }} />
                        </Stack>
                        <Button type="submit" variant="contained" disabled={savingProfile} size="small">
                            {savingProfile ? 'Saving…' : 'Save Changes'}
                        </Button>
                    </form>
                </Section>

                {/* Change password */}
                <Section tag="◊" title="Change Password">
                    <form onSubmit={handleChangePassword}>
                        <Stack spacing={2} maxWidth={400} mb={2}>
                            <TextField
                                label="Current Password"
                                type={showPass ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setShowPass(v => !v)} tabIndex={-1} edge="end">
                                                {showPass ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField label="New Password" type={showPass ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} size="small" />
                            <TextField label="Confirm New Password" type={showPass ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} size="small" />
                        </Stack>
                        <Button type="submit" variant="contained" disabled={savingPassword} size="small">
                            {savingPassword ? 'Updating…' : 'Change Password'}
                        </Button>
                    </form>
                </Section>
            </Box>
        </>
    );
};

export default Profile;
