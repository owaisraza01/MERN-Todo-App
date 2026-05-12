import React, { useState } from 'react';
import {
    IconButton, Badge, Popover, Box, Typography, Divider,
    Button, CircularProgress, useTheme,
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import { useNotifications } from '../../hooks/useNotifications';

const TYPE_COLOR = {
    task_assigned: '#6366f1',
    comment_added: '#06b6d4',
    status_changed: '#10b981',
};

const timeAgo = date => {
    const s = (Date.now() - new Date(date)) / 1000;
    if (s < 60) return 'now';
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
};

const NotificationBell = () => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const [anchor, setAnchor] = useState(null);
    const { notifications, loading, refresh, markRead, markAllRead } = useNotifications();

    const open = Boolean(anchor);
    const unread = notifications.filter(n => !n.read).length;

    const handleOpen = async e => {
        setAnchor(e.currentTarget);
        await refresh();
    };

    return (
        <>
            <IconButton size="small" onClick={handleOpen} sx={{ color: 'text.secondary', borderRadius: 1.5 }}>
                <Badge
                    badgeContent={unread}
                    color="error"
                    max={9}
                    sx={{ '& .MuiBadge-badge': { fontSize: 9, minWidth: 14, height: 14, padding: '0 3px' } }}
                >
                    <NotificationsOutlinedIcon sx={{ fontSize: 18 }} />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        width: 320,
                        mt: 0.5,
                        backgroundImage: 'none',
                        bgcolor: dark ? '#0d1424' : '#fff',
                    },
                }}
            >
                {/* Header */}
                <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontSize={13} fontWeight={600}>Notifications</Typography>
                        {unread > 0 && (
                            <Box
                                sx={{
                                    px: 0.875,
                                    py: 0.1,
                                    borderRadius: 0.75,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#ef4444',
                                    bgcolor: 'rgba(239,68,68,0.12)',
                                }}
                            >
                                {unread}
                            </Box>
                        )}
                    </Box>
                    {unread > 0 && (
                        <Button
                            size="small"
                            onClick={markAllRead}
                            startIcon={<DoneAllRoundedIcon sx={{ fontSize: 14 }} />}
                            sx={{ fontSize: 11, color: 'text.secondary', py: 0.3 }}
                        >
                            Mark all read
                        </Button>
                    )}
                </Box>

                <Divider />

                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress size={20} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box py={5} textAlign="center">
                        <NotificationsOutlinedIcon sx={{ fontSize: 28, color: 'text.disabled', mb: 1 }} />
                        <Typography fontSize={13} color="text.disabled">No notifications</Typography>
                    </Box>
                ) : (
                    <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
                        {notifications.map((n, i) => (
                            <Box key={n._id}>
                                <Box
                                    onClick={() => markRead(n._id)}
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        display: 'flex',
                                        gap: 1.5,
                                        cursor: 'pointer',
                                        bgcolor: n.read ? 'transparent' : (dark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)'),
                                        '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.03)' },
                                        transition: 'background 0.12s',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 3,
                                            borderRadius: 1,
                                            flexShrink: 0,
                                            alignSelf: 'stretch',
                                            bgcolor: n.read ? 'transparent' : (TYPE_COLOR[n.type] || '#6366f1'),
                                        }}
                                    />
                                    <Box flex={1} minWidth={0}>
                                        <Typography
                                            fontSize={12.5}
                                            fontWeight={n.read ? 400 : 500}
                                            lineHeight={1.45}
                                            color={n.read ? 'text.secondary' : 'text.primary'}
                                        >
                                            {n.message}
                                        </Typography>
                                        <Typography fontSize={11} color="text.disabled" mt={0.4}>
                                            {timeAgo(n.createdAt)} ago · {n.type.replace('_', ' ')}
                                        </Typography>
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
