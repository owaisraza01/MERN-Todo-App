import React, { useState } from 'react';
import {
    IconButton, Badge, Popover, Box, Typography, List, ListItem,
    ListItemText, Divider, Button, Chip, CircularProgress, useTheme,
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import { useNotifications } from '../../hooks/useNotifications';

const TYPE_COLORS = {
    task_assigned: 'primary',
    comment_added: 'info',
    status_changed: 'success',
};

const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const { notifications, loading, refresh, markRead, markAllRead } = useNotifications();

    const open = Boolean(anchorEl);
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleOpen = async (e) => {
        setAnchorEl(e.currentTarget);
        await refresh();
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{ color: open ? 'primary.main' : 'text.secondary', transition: 'color 0.2s' }}
            >
                <Badge badgeContent={unreadCount} color="error" max={9}>
                    {unreadCount > 0
                        ? <NotificationsRoundedIcon />
                        : <NotificationsNoneRoundedIcon />
                    }
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        width: 340,
                        borderRadius: 3,
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 8px 32px rgba(0,0,0,0.5)'
                            : '0 8px 32px rgba(33,147,176,0.15)',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: theme.palette.mode === 'dark' ? '#1e2533' : '#fff',
                    },
                }}
            >
                <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography fontWeight={800} fontSize={15}>
                        Notifications
                        {unreadCount > 0 && (
                            <Chip label={unreadCount} size="small" color="error" sx={{ ml: 1, height: 18, fontSize: 11, fontWeight: 700 }} />
                        )}
                    </Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            startIcon={<DoneAllRoundedIcon />}
                            onClick={markAllRead}
                            sx={{ textTransform: 'none', fontWeight: 600, fontSize: 12 }}
                        >
                            Mark all read
                        </Button>
                    )}
                </Box>

                <Divider />

                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress size={24} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box py={5} textAlign="center">
                        <NotificationsNoneRoundedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.disabled">No notifications yet</Typography>
                    </Box>
                ) : (
                    <List disablePadding sx={{ maxHeight: 380, overflowY: 'auto' }}>
                        {notifications.map((n, i) => (
                            <React.Fragment key={n._id}>
                                <ListItem
                                    alignItems="flex-start"
                                    onClick={() => markRead(n._id)}
                                    sx={{
                                        cursor: 'pointer',
                                        px: 2.5,
                                        py: 1.5,
                                        bgcolor: n.read
                                            ? 'transparent'
                                            : theme.palette.mode === 'dark'
                                                ? 'rgba(109,213,237,0.06)'
                                                : 'rgba(33,147,176,0.05)',
                                        '&:hover': { bgcolor: 'action.hover' },
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                                        {!n.read && (
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, mt: 0.75 }} />
                                        )}
                                        <Box sx={{ flex: 1, ml: n.read ? 2 : 0 }}>
                                            <ListItemText
                                                primary={
                                                    <Typography fontSize={13} fontWeight={n.read ? 400 : 600} lineHeight={1.4}>
                                                        {n.message}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                                        <Chip
                                                            label={n.type.replace('_', ' ')}
                                                            size="small"
                                                            color={TYPE_COLORS[n.type] || 'default'}
                                                            sx={{ height: 16, fontSize: 10, fontWeight: 700, textTransform: 'capitalize' }}
                                                        />
                                                        <Typography fontSize={11} color="text.disabled">
                                                            {timeAgo(n.createdAt)}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </Box>
                                    </Box>
                                </ListItem>
                                {i < notifications.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Popover>
        </>
    );
};

export default NotificationBell;
