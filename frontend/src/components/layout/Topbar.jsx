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
                background: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
            }}
        >
            <Toolbar sx={{ minHeight: '52px !important', px: 2 }}>
                <IconButton
                    edge="start"
                    onClick={onMenuClick}
                    size="small"
                    sx={{ mr: 1.5, color: 'text.secondary' }}
                >
                    <MenuRoundedIcon fontSize="small" />
                </IconButton>
                <Typography fontWeight={700} fontSize={14} letterSpacing="-0.02em" sx={{ flex: 1 }}>
                    TaskFlow
                </Typography>
                <NotificationBell />
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
