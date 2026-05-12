import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness7, Brightness4 } from '@mui/icons-material';

const ThemeToggle = ({ mode, setMode }) => (
    <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'} placement="top">
        <IconButton
            size="small"
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            sx={{ color: 'text.secondary', borderRadius: 1.5 }}
        >
            {mode === 'dark'
                ? <Brightness7 sx={{ fontSize: 18 }} />
                : <Brightness4 sx={{ fontSize: 18 }} />
            }
        </IconButton>
    </Tooltip>
);

export default ThemeToggle;
