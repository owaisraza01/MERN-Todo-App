import React from 'react';
import { Box, Skeleton, Grid } from '@mui/material';

export const DashboardSkeleton = () => (
    <Grid container spacing={2.5}>
        {[...Array(4)].map((_, i) => (
            <Grid item xs={6} sm={3} key={i}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: 'background.paper' }}>
                    <Skeleton variant="rectangular" width={28} height={3} sx={{ mb: 2, borderRadius: 1 }} />
                    <Skeleton variant="text" width="45%" height={40} />
                    <Skeleton variant="text" width="55%" height={16} />
                </Box>
            </Grid>
        ))}
        {[...Array(2)].map((_, i) => (
            <Grid item xs={12} md={6} key={`c${i}`}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: 'background.paper' }}>
                    <Skeleton variant="text" width="40%" height={18} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                </Box>
            </Grid>
        ))}
    </Grid>
);

export const TaskTableSkeleton = () => (
    <Box>
        {[...Array(7)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 0.75, borderRadius: 1 }} />
        ))}
    </Box>
);
