import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

const EmptyState = ({
    title = 'Nothing here',
    subtitle = 'Create something to get started',
    actionLabel,
    onAction,
    icon: Icon = AssignmentRoundedIcon,
}) => (
    <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
        <Icon sx={{ fontSize: 36, color: 'text.disabled', mb: 2 }} />
        <Typography fontSize={14} fontWeight={600} color="text.secondary" gutterBottom>
            {title}
        </Typography>
        <Typography fontSize={13} color="text.disabled" sx={{ maxWidth: 300, mx: 'auto', mb: 3 }}>
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
