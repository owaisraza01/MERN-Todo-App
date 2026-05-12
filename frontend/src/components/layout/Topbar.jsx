import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, useTheme } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationBell from '../notifications/NotificationBell';

const Topbar = ({ onMenuClick }) => {
    const theme = useTheme();

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                display: { md: 'none' },
                background: theme.palette.mode === 'dark' ? '#1a1d23' : '#ffffff',
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
            }}
        >
            <Toolbar>
                <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1, color: 'text.primary' }}>
                    <MenuRoundedIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    fontWeight={900}
                    color="primary"
                    sx={{ letterSpacing: -0.5, fontFamily: '"Inter", sans-serif', flex: 1 }}
                >
                    TaskFlow
                </Typography>
                <NotificationBell />
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
