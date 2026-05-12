import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, TextField, Button, Avatar,
    Divider, Stack, Chip, useTheme, InputAdornment, IconButton,
} from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';

const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
};

const Profile = () => {
    const theme = useTheme();
    const tokenUser = getUserFromToken();

    const [name, setName] = useState(tokenUser?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const token = () => localStorage.getItem('token');
    const headers = () => ({ Authorization: `Bearer ${token()}` });

    const inputBg = theme.palette.mode === 'dark' ? 'rgba(44,62,80,0.5)' : '#f8fbff';

    const handleSaveProfile = async e => {
        e.preventDefault();
        if (!name.trim()) return;
        setSavingProfile(true);
        try {
            await axios.put('/api/users/profile', { name }, { headers: headers() });
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
            await axios.put('/api/users/profile', { currentPassword, newPassword }, { headers: headers() });
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

    return (
        <Box>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" gap={1} mb={3}>
                        <AccountCircleRoundedIcon color="primary" />
                        <Typography variant="h6" fontWeight={800} color="primary">Profile</Typography>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" gap={3} mb={3}>
                        <Avatar
                            sx={{
                                width: 72,
                                height: 72,
                                fontSize: 28,
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #6dd5ed, #2193b0)',
                                flexShrink: 0,
                            }}
                        >
                            {initials}
                        </Avatar>
                        <Box>
                            <Typography fontWeight={700} fontSize={18}>{tokenUser?.name || 'User'}</Typography>
                            <Typography color="text.secondary" fontSize={14}>{tokenUser?.email}</Typography>
                            <Stack direction="row" gap={1} mt={0.5}>
                                <Chip
                                    label={tokenUser?.role || 'user'}
                                    size="small"
                                    color={tokenUser?.role === 'admin' ? 'error' : 'primary'}
                                    sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                                />
                            </Stack>
                        </Box>
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    <form onSubmit={handleSaveProfile}>
                        <Typography fontWeight={700} fontSize={14} mb={2}>Edit Info</Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="flex-start">
                            <TextField
                                label="Display Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                size="small"
                                sx={{ flex: 1 }}
                                InputProps={{ sx: { borderRadius: 2, bgcolor: inputBg } }}
                            />
                            <TextField
                                label="Email"
                                value={tokenUser?.email || ''}
                                size="small"
                                disabled
                                sx={{ flex: 1 }}
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                        </Stack>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveRoundedIcon />}
                            disabled={savingProfile}
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                fontWeight: 700,
                                textTransform: 'none',
                                background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                                '&:hover': { background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' },
                            }}
                        >
                            {savingProfile ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" gap={1} mb={3}>
                        <LockRoundedIcon color="primary" />
                        <Typography variant="h6" fontWeight={800} color="primary">Change Password</Typography>
                    </Stack>

                    <form onSubmit={handleChangePassword}>
                        <Stack spacing={2} maxWidth={400}>
                            <TextField
                                label="Current Password"
                                type={showPass ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                size="small"
                                InputProps={{
                                    sx: { borderRadius: 2, bgcolor: inputBg },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                                                {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
                                InputProps={{ sx: { borderRadius: 2, bgcolor: inputBg } }}
                            />
                            <TextField
                                label="Confirm New Password"
                                type={showPass ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                size="small"
                                InputProps={{ sx: { borderRadius: 2, bgcolor: inputBg } }}
                            />
                        </Stack>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<LockRoundedIcon />}
                            disabled={savingPassword}
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                fontWeight: 700,
                                textTransform: 'none',
                                background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                                '&:hover': { background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' },
                            }}
                        >
                            {savingPassword ? 'Updating...' : 'Change Password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Profile;
