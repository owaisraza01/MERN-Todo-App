import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { tokens } from '../../theme/theme';

const EmptyState = ({
    title = 'Nothing here',
    subtitle = 'Create something to get started',
    actionLabel,
    onAction,
}) => (
    <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: tokens.accent, letterSpacing: '0.18em', mb: 2 }}>
            // EMPTY STATE
        </Typography>
        <Typography sx={{ fontFamily: tokens.fontDisplay, fontSize: 24, fontWeight: 700, letterSpacing: '-0.025em', color: 'text.primary', mb: 1 }}>
            {title}
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', maxWidth: 320, mx: 'auto', mb: actionLabel ? 3 : 0 }}>
            {subtitle}
        </Typography>
        {actionLabel && onAction && (
            <Button variant="contained" onClick={onAction} size="small">
                {actionLabel}
            </Button>
        )}
    </Box>
);

export default EmptyState;
