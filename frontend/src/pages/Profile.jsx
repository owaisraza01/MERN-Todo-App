import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, Avatar,
    Divider, Stack, InputAdornment, IconButton, useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const SectionCard = ({ children }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    return (
        <Box
            sx={{
                border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.09)'}`,
                borderRadius: 1.5,
                p: 3,
                mb: 2.5,
                bgcolor: 'background.paper',
            }}
        >
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
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async e => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
        if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setSavingPassword(true);
        try {
            await axios.put('/api/users/profile', { currentPassword, newPassword }, { headers: authHeader });
            toast.success('Password changed');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSavingPassword(false);
        }
    };

    const initials = (name || tokenUser?.email || 'U')[0].toUpperCase();
    const isAdmin = tokenUser?.role === 'admin';

    return (
        <Box maxWidth={640}>
            {/* Identity card */}
            <SectionCard>
                <Stack direction="row" alignItems="center" gap={2.5}>
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            fontSize: 24,
                            fontWeight: 700,
                            bgcolor: '#6366f1',
                            flexShrink: 0,
                        }}
                    >
                        {initials}
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                        <Typography fontWeight={700} fontSize={16} noWrap>
                            {tokenUser?.name || 'User'}
                        </Typography>
                        <Typography fontSize={13} color="text.secondary" noWrap>
                            {tokenUser?.email}
                        </Typography>
                        <Box
                            sx={{
                                mt: 0.75,
                                display: 'inline-flex',
                                px: 0.875,
                                py: 0.2,
                                borderRadius: 0.75,
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                color: isAdmin ? '#ef4444' : '#6366f1',
                                bgcolor: isAdmin ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                                textTransform: 'uppercase',
                            }}
                        >
                            {tokenUser?.role || 'user'}
                        </Box>
                    </Box>
                </Stack>
            </SectionCard>

            {/* Edit profile */}
            <SectionCard>
                <Typography fontSize={11} fontWeight={700} letterSpacing="0.06em" color="text.disabled" mb={2}>
                    PROFILE INFO
                </Typography>

                <form onSubmit={handleSaveProfile}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
                        <TextField
                            label="Display Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            size="small"
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Email"
                            value={tokenUser?.email || ''}
                            size="small"
                            disabled
                            sx={{ flex: 1 }}
                        />
                    </Stack>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={savingProfile}
                        size="small"
                        sx={{ fontSize: 13, fontWeight: 600 }}
                    >
                        {savingProfile ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </SectionCard>

            {/* Change password */}
            <SectionCard>
                <Typography fontSize={11} fontWeight={700} letterSpacing="0.06em" color="text.disabled" mb={2}>
                    CHANGE PASSWORD
                </Typography>

                <form onSubmit={handleChangePassword}>
                    <Stack spacing={2} maxWidth={380} mb={2}>
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
                        <TextField
                            label="New Password"
                            type={showPass ? 'text' : 'password'}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            size="small"
                        />
                        <TextField
                            label="Confirm New Password"
                            type={showPass ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            size="small"
                        />
                    </Stack>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={savingPassword}
                        size="small"
                        sx={{ fontSize: 13, fontWeight: 600 }}
                    >
                        {savingPassword ? 'Updating...' : 'Change Password'}
                    </Button>
                </form>
            </SectionCard>
        </Box>
    );
};

export default Profile;
