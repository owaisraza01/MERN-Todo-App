import React from 'react';
import { Box, Drawer, Tooltip, useTheme, Avatar, Divider } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ThemeToggle from '../ThemeToggle';
import NotificationBell from '../notifications/NotificationBell';
import { useAuth } from '../../hooks/useAuth';
import { tokens } from '../../theme/theme';

export const SIDEBAR_WIDTH = 64;

const NAV_ITEMS = [
    { label: 'Dashboard', icon: DashboardRoundedIcon, view: 'dashboard', key: '01' },
    { label: 'Tasks',     icon: AssignmentRoundedIcon, view: 'tasks',     key: '02' },
    { label: 'Analytics', icon: BarChartRoundedIcon,  view: 'analytics', key: '03' },
    { label: 'Profile',   icon: AccountCircleRoundedIcon, view: 'profile', key: '04' },
];

const RailButton = ({ active, onClick, children, label }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    return (
        <Tooltip title={label} placement="right">
            <Box
                onClick={onClick}
                role="button"
                sx={{
                    position: 'relative',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: active ? tokens.accentInk : (dark ? '#71717a' : '#52525b'),
                    bgcolor: active ? tokens.accent : 'transparent',
                    transition: 'all 0.12s ease',
                    '&:hover': {
                        color: active ? tokens.accentInk : (dark ? '#fafafa' : '#0a0a0d'),
                        bgcolor: active ? tokens.accent : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(10,10,13,0.05)'),
                    },
                }}
            >
                {children}
            </Box>
        </Tooltip>
    );
};

const RailContent = ({ activeView, setActiveView, onLogout, mode, setMode }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const { user } = useAuth();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', py: 1.5, gap: 1 }}>
            {/* Brand mark */}
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(10,10,13,0.16)'}`,
                    fontFamily: tokens.fontMono,
                    fontWeight: 700,
                    fontSize: 13,
                    color: tokens.accent,
                    letterSpacing: '-0.04em',
                }}
            >
                T/
            </Box>

            <Box sx={{ height: 1, width: 24, bgcolor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(10,10,13,0.08)', my: 1 }} />

            {/* Nav */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    const active = activeView === item.view;
                    return (
                        <RailButton
                            key={item.view}
                            label={`${item.key} · ${item.label}`}
                            active={active}
                            onClick={() => setActiveView(item.view)}
                        >
                            <Icon sx={{ fontSize: 18 }} />
                        </RailButton>
                    );
                })}
            </Box>

            {/* Bottom controls */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                <NotificationBell />
                <ThemeToggle mode={mode} setMode={setMode} />

                {user && (
                    <>
                        <Box sx={{ height: 1, width: 24, bgcolor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(10,10,13,0.08)', my: 0.5 }} />
                        <Tooltip title={user.name || user.email || 'User'} placement="right">
                            <Avatar
                                sx={{
                                    width: 28,
                                    height: 28,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    bgcolor: 'transparent',
                                    color: tokens.accent,
                                    border: `1px solid ${tokens.accent}`,
                                    fontFamily: tokens.fontMono,
                                }}
                            >
                                {(user.name || user.email || 'U')[0].toUpperCase()}
                            </Avatar>
                        </Tooltip>
                    </>
                )}

                <RailButton label="Logout" active={false} onClick={onLogout}>
                    <LogoutRoundedIcon sx={{ fontSize: 18, color: '#f43f5e' }} />
                </RailButton>
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
    overflow: 'visible',
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
                <RailContent {...props} />
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
                <RailContent
                    {...props}
                    setActiveView={v => { setActiveView(v); setMobileOpen(false); }}
                />
            </Drawer>
        </>
    );
};

export default Sidebar;
