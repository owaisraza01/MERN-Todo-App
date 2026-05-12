import React from 'react';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Typography, Divider, Tooltip, useTheme, Avatar,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ThemeToggle from '../ThemeToggle';
import NotificationBell from '../notifications/NotificationBell';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assests/images/logo.png';

export const SIDEBAR_WIDTH = 240;

const NAV_ITEMS = [
    { label: 'Dashboard', icon: <DashboardRoundedIcon fontSize="small" />, view: 'dashboard' },
    { label: 'Tasks', icon: <AssignmentRoundedIcon fontSize="small" />, view: 'tasks' },
    { label: 'Analytics', icon: <BarChartRoundedIcon fontSize="small" />, view: 'analytics' },
    { label: 'Profile', icon: <AccountCircleRoundedIcon fontSize="small" />, view: 'profile' },
];

const SidebarContent = ({ activeView, setActiveView, onLogout, mode, setMode }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const { user } = useAuth();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Brand */}
            <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    component="img"
                    src={logo}
                    alt="TaskFlow"
                    sx={{ width: 28, height: 28, borderRadius: 1, objectFit: 'contain', flexShrink: 0 }}
                />
                <Typography
                    fontWeight={700}
                    fontSize={15}
                    letterSpacing="-0.02em"
                    color="text.primary"
                >
                    TaskFlow
                </Typography>
            </Box>

            <Divider />

            {/* Nav */}
            <List sx={{ flex: 1, pt: 1.5, px: 1.5, pb: 1 }}>
                {NAV_ITEMS.map(item => {
                    const active = activeView === item.view;
                    return (
                        <ListItem key={item.view} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                selected={active}
                                onClick={() => setActiveView(item.view)}
                                sx={{
                                    borderRadius: 1.5,
                                    py: 0.85,
                                    px: 1.5,
                                    gap: 0,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&.Mui-selected': {
                                        bgcolor: dark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
                                    },
                                    '&.Mui-selected::before': {
                                        content: '""',
                                        position: 'absolute',
                                        left: 0,
                                        top: '25%',
                                        bottom: '25%',
                                        width: 3,
                                        borderRadius: '0 2px 2px 0',
                                        background: '#6366f1',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 34,
                                        color: active ? '#6366f1' : 'text.secondary',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: 13.5,
                                        fontWeight: active ? 600 : 400,
                                        color: active ? '#6366f1' : 'text.primary',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider />

            {/* User */}
            {user && (
                <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        sx={{
                            width: 28,
                            height: 28,
                            fontSize: 12,
                            fontWeight: 700,
                            bgcolor: '#6366f1',
                            flexShrink: 0,
                        }}
                    >
                        {(user.name || user.email || 'U')[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
                        <Typography fontSize={12.5} fontWeight={600} noWrap>
                            {user.name || 'User'}
                        </Typography>
                        <Typography fontSize={11} color="text.secondary" noWrap>
                            {user.role || 'member'}
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* Bottom actions */}
            <Box sx={{ px: 1.5, pb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ThemeToggle mode={mode} setMode={setMode} />
                <NotificationBell />
                <Tooltip title="Logout" placement="top">
                    <ListItemButton
                        onClick={onLogout}
                        sx={{
                            borderRadius: 1.5,
                            py: 0.75,
                            px: 1.5,
                            flex: 1,
                            color: 'error.main',
                            gap: 0.75,
                        }}
                    >
                        <LogoutRoundedIcon sx={{ fontSize: 16 }} />
                        <Typography fontWeight={500} fontSize={13} color="error.main">Logout</Typography>
                    </ListItemButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

const paperSx = (theme) => ({
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
    background: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
});

const Sidebar = ({ mode, setMode, onLogout, activeView, setActiveView, mobileOpen, setMobileOpen }) => {
    const theme = useTheme();
    const props = { activeView, setActiveView, onLogout, mode, setMode };

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': paperSx(theme),
                }}
            >
                <SidebarContent {...props} />
            </Drawer>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': paperSx(theme),
                }}
            >
                <SidebarContent
                    {...props}
                    setActiveView={v => { setActiveView(v); setMobileOpen(false); }}
                />
            </Drawer>
        </>
    );
};

export default Sidebar;
