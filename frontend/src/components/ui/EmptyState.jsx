import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

const EmptyState = ({
    title = 'No tasks yet',
    subtitle = 'Create your first task to get started',
    actionLabel,
    onAction,
    icon: Icon = AssignmentRoundedIcon,
}) => (
    <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
        <Box
            sx={{
                display: 'inline-flex',
                p: 3,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(109,213,237,0.15), rgba(33,147,176,0.15))',
                mb: 3,
            }}
        >
            <Icon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.6 }} />
        </Box>
        <Typography variant="h6" fontWeight={700} color="text.secondary" gutterBottom>
            {title}
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mb: 3, maxWidth: 320, mx: 'auto' }}>
            {subtitle}
        </Typography>
        {actionLabel && onAction && (
            <Button
                variant="contained"
                onClick={onAction}
                sx={{
                    background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    '&:hover': { background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' },
                }}
            >
                {actionLabel}
            </Button>
        )}
    </Box>
);

export default EmptyState;
