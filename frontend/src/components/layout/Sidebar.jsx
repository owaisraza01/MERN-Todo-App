import React from 'react';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Typography, Divider, Tooltip, useTheme,
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
import { Avatar } from '@mui/material';

export const SIDEBAR_WIDTH = 260;

const NAV_ITEMS = [
    { label: 'Dashboard', icon: <DashboardRoundedIcon />, view: 'dashboard' },
    { label: 'Tasks', icon: <AssignmentRoundedIcon />, view: 'tasks' },
    { label: 'Analytics', icon: <BarChartRoundedIcon />, view: 'analytics' },
    { label: 'Profile', icon: <AccountCircleRoundedIcon />, view: 'profile' },
];

const SidebarContent = ({ activeView, setActiveView, onLogout, mode, setMode }) => {
    const theme = useTheme();
    const { user } = useAuth();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    component="img"
                    src={logo}
                    alt="TaskFlow"
                    sx={{ width: 36, height: 36, borderRadius: 1.5, objectFit: 'contain' }}
                />
                <Typography
                    variant="h6"
                    fontWeight={900}
                    color="primary"
                    sx={{ letterSpacing: -0.5, fontFamily: '"Inter", sans-serif' }}
                >
                    TaskFlow
                </Typography>
            </Box>

            <Divider />

            <List sx={{ flex: 1, pt: 2, px: 1.5 }}>
                {NAV_ITEMS.map(item => {
                    const isActive = activeView === item.view;
                    return (
                        <ListItem key={item.view} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                selected={isActive}
                                onClick={() => setActiveView(item.view)}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.2,
                                    '&.Mui-selected': {
                                        background: theme.palette.mode === 'dark'
                                            ? 'rgba(109,213,237,0.13)'
                                            : 'rgba(33,147,176,0.10)',
                                    },
                                    '&.Mui-selected:hover': {
                                        background: theme.palette.mode === 'dark'
                                            ? 'rgba(109,213,237,0.18)'
                                            : 'rgba(33,147,176,0.15)',
                                    },
                                    '&:hover': {
                                        background: theme.palette.mode === 'dark'
                                            ? 'rgba(255,255,255,0.05)'
                                            : 'rgba(33,147,176,0.06)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 42, color: isActive ? 'primary.main' : 'text.secondary' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: 15,
                                        color: isActive ? 'primary.main' : 'text.primary',
                                    }}
                                />
                                {isActive && (
                                    <Box sx={{
                                        width: 4, height: 24, borderRadius: 2,
                                        background: 'linear-gradient(180deg, #6dd5ed, #2193b0)',
                                        flexShrink: 0,
                                    }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider />

            {user && (
                <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 34, height: 34, fontSize: 14, fontWeight: 700, background: 'linear-gradient(135deg, #6dd5ed, #2193b0)' }}>
                        {(user.name || user.email || 'U')[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden', flex: 1 }}>
                        <Typography fontSize={13} fontWeight={700} noWrap>{user.name || 'User'}</Typography>
                        <Typography fontSize={11} color="text.secondary" noWrap>{user.email || ''}</Typography>
                    </Box>
                </Box>
            )}

            <Box sx={{ px: 1.5, pb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ThemeToggle mode={mode} setMode={setMode} />
                <NotificationBell />
                <Tooltip title="Logout">
                    <ListItemButton
                        onClick={onLogout}
                        sx={{ borderRadius: 2, py: 1, color: 'error.main', flex: 1 }}
                    >
                        <LogoutRoundedIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography fontWeight={600} fontSize={14} color="error.main">
                            Logout
                        </Typography>
                    </ListItemButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

const drawerPaperSx = (theme) => ({
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
    background: theme.palette.mode === 'dark' ? '#1a1d23' : '#ffffff',
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark'
        ? '2px 0 16px rgba(0,0,0,0.4)'
        : '2px 0 16px rgba(33,147,176,0.07)',
});

const Sidebar = ({ mode, setMode, onLogout, activeView, setActiveView, mobileOpen, setMobileOpen }) => {
    const theme = useTheme();
    const contentProps = { activeView, setActiveView, onLogout, mode, setMode };

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': drawerPaperSx(theme),
                }}
            >
                <SidebarContent {...contentProps} />
            </Drawer>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': drawerPaperSx(theme),
                }}
            >
                <SidebarContent
                    {...contentProps}
                    setActiveView={(v) => { setActiveView(v); setMobileOpen(false); }}
                />
            </Drawer>
        </>
    );
};

export default Sidebar;
