import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, useTheme } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationBell from '../notifications/NotificationBell';
import { tokens } from '../../theme/theme';

const Topbar = ({ onMenuClick }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                display: { md: 'none' },
                background: theme.palette.background.paper,
                borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,10,13,0.08)'}`,
                color: theme.palette.text.primary,
                backgroundImage: 'none',
            }}
        >
            <Toolbar sx={{ minHeight: '52px !important', px: 2 }}>
                <IconButton edge="start" onClick={onMenuClick} size="small" sx={{ mr: 1.5, color: 'text.secondary' }}>
                    <MenuRoundedIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ flex: 1, fontFamily: tokens.fontMono, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Task<Typography component="span" sx={{ color: tokens.accent, fontFamily: tokens.fontMono, fontSize: 12, fontWeight: 600 }}>Flow</Typography>
                </Typography>
                <NotificationBell />
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
