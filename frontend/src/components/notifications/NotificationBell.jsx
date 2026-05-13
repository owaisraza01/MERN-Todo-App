import React, { useState } from 'react';
import {
    Box, Badge, Popover, Typography, Divider,
    Button, CircularProgress, useTheme, Tooltip,
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import { useNotifications } from '../../hooks/useNotifications';
import { tokens } from '../../theme/theme';

const TYPE_COLOR = {
    task_assigned:  tokens.accent,
    comment_added:  '#06b6d4',
    status_changed: '#22c55e',
};

const timeAgo = date => {
    const s = (Date.now() - new Date(date)) / 1000;
    if (s < 60) return 'NOW';
    if (s < 3600) return `${Math.floor(s / 60)}M`;
    if (s < 86400) return `${Math.floor(s / 3600)}H`;
    return `${Math.floor(s / 86400)}D`;
};

const NotificationBell = () => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const [anchor, setAnchor] = useState(null);
    const { notifications, loading, refresh, markRead, markAllRead } = useNotifications();
    const open = Boolean(anchor);
    const unread = notifications.filter(n => !n.read).length;

    const handleOpen = async e => { setAnchor(e.currentTarget); await refresh(); };

    return (
        <>
            <Tooltip title="Notifications" placement="right">
                <Box
                    onClick={handleOpen}
                    role="button"
                    sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: dark ? '#71717a' : '#52525b',
                        transition: 'all 0.12s',
                        position: 'relative',
                        '&:hover': {
                            color: dark ? '#fafafa' : '#0a0a0d',
                            bgcolor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(10,10,13,0.05)',
                        },
                    }}
                >
                    <Badge
                        badgeContent={unread}
                        max={9}
                        sx={{
                            '& .MuiBadge-badge': {
                                bgcolor: tokens.accent,
                                color: tokens.accentInk,
                                fontFamily: tokens.fontMono,
                                fontSize: 9,
                                fontWeight: 700,
                                minWidth: 14,
                                height: 14,
                                padding: '0 3px',
                                borderRadius: 0,
                            },
                        }}
                    >
                        <NotificationsOutlinedIcon sx={{ fontSize: 17 }} />
                    </Badge>
                </Box>
            </Tooltip>

            <Popover
                open={open}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 340,
                            ml: 1,
                            backgroundImage: 'none',
                            bgcolor: dark ? '#111114' : '#fff',
                            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(10,10,13,0.1)'}`,
                            borderRadius: 0.5,
                        },
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,13,0.06)'}` }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Notifications
                        </Typography>
                        {unread > 0 && (
                            <Box sx={{
                                px: 0.625, py: 0.1, fontFamily: tokens.fontMono, fontSize: 10, fontWeight: 700,
                                color: tokens.accentInk, bgcolor: tokens.accent,
                            }}>
                                {unread}
                            </Box>
                        )}
                    </Box>
                    {unread > 0 && (
                        <Button
                            size="small"
                            onClick={markAllRead}
                            startIcon={<DoneAllRoundedIcon sx={{ fontSize: 12 }} />}
                            sx={{ fontSize: 11, fontFamily: tokens.fontMono, color: 'text.secondary', py: 0.2, px: 0.75, minWidth: 0, textTransform: 'uppercase' }}
                        >
                            Read all
                        </Button>
                    )}
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress size={18} sx={{ color: tokens.accent }} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box py={5} textAlign="center">
                        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: 'text.disabled', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            — No notifications —
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ maxHeight: 380, overflowY: 'auto' }}>
                        {notifications.map((n, i) => (
                            <Box key={n._id}>
                                <Box
                                    onClick={() => markRead(n._id)}
                                    sx={{
                                        px: 2, py: 1.5, display: 'flex', gap: 1.5, cursor: 'pointer',
                                        bgcolor: n.read ? 'transparent' : (dark ? 'rgba(212,255,58,0.04)' : 'rgba(184,230,44,0.05)'),
                                        '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.03)' : 'rgba(10,10,13,0.03)' },
                                    }}
                                >
                                    <Box sx={{
                                        width: 2, flexShrink: 0, alignSelf: 'stretch',
                                        bgcolor: n.read ? 'transparent' : (TYPE_COLOR[n.type] || tokens.accent),
                                    }} />
                                    <Box flex={1} minWidth={0}>
                                        <Typography fontSize={12.5} fontWeight={n.read ? 400 : 500} lineHeight={1.45} color={n.read ? 'text.secondary' : 'text.primary'}>
                                            {n.message}
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                            <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.disabled', letterSpacing: '0.06em' }}>
                                                {timeAgo(n.createdAt)} AGO
                                            </Typography>
                                            <Box sx={{ width: 2, height: 2, bgcolor: 'text.disabled' }} />
                                            <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.disabled', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                                {n.type.replace('_', ' ')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                {i < notifications.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </Box>
                )}
            </Popover>
        </>
    );
};

export default NotificationBell;
