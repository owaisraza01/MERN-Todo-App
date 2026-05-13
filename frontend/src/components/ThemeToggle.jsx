import React from 'react';
import { Box, Tooltip, useTheme } from '@mui/material';
import { Brightness7, Brightness4 } from '@mui/icons-material';

const ThemeToggle = ({ mode, setMode }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    return (
        <Tooltip title={mode === 'dark' ? 'Light' : 'Dark'} placement="right">
            <Box
                onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
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
                    '&:hover': {
                        color: dark ? '#fafafa' : '#0a0a0d',
                        bgcolor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(10,10,13,0.05)',
                    },
                }}
            >
                {mode === 'dark'
                    ? <Brightness7 sx={{ fontSize: 17 }} />
                    : <Brightness4 sx={{ fontSize: 17 }} />}
            </Box>
        </Tooltip>
    );
};

export default ThemeToggle;
