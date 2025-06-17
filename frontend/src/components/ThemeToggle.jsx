import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Brightness7, Brightness4 } from '@mui/icons-material';

const ThemeToggle = ({ mode, setMode }) => (
    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
        <Box>
            <IconButton
                sx={{
                    ml: 1,
                    borderRadius: 2,
                    background: mode === 'dark'
                        ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
                        : 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
                    color: mode === 'dark' ? '#ffe082' : '#1976d2',
                    boxShadow: '0 2px 8px 0 rgba(33,147,176,0.11)',
                    '&:hover': {
                        background: mode === 'dark'
                            ? 'linear-gradient(135deg, #232526 0%, #757f9a 100%)'
                            : 'linear-gradient(135deg, #cfdef3 0%, #e0eafc 100%)',
                    },
                    transition: 'background 0.3s',
                }}
                onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                aria-label="toggle theme"
            >
                {mode === 'dark'
                    ? <Brightness7 fontSize="medium" />
                    : <Brightness4 fontSize="medium" />
                }
            </IconButton>
        </Box>
    </Tooltip>
);

export default ThemeToggle;