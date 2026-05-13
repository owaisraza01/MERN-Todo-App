import React from 'react';
import { Box, Skeleton, Grid } from '@mui/material';

export const DashboardSkeleton = () => (
    <Box
        sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' },
            gridAutoRows: 'minmax(140px, auto)',
        }}
    >
        <Box sx={{ gridColumn: { sm: 'span 4', lg: 'span 4' }, gridRow: 'span 2', p: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Skeleton variant="rectangular" width={80} height={10} sx={{ mb: 3 }} />
            <Skeleton variant="text" width="40%" height={120} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={2} sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                {[0, 1, 2].map(i => (
                    <Grid item xs={4} key={i}>
                        <Skeleton variant="text" width="50%" height={32} />
                        <Skeleton variant="text" width="60%" height={12} />
                    </Grid>
                ))}
            </Grid>
        </Box>
        {[1, 2, 3, 4].map(i => (
            <Box key={i} sx={{ gridColumn: { sm: 'span 2' }, p: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Skeleton variant="rectangular" width={80} height={10} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="55%" height={56} />
            </Box>
        ))}
    </Box>
);

export const TaskTableSkeleton = () => (
    <Box>
        {[...Array(7)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 0.5, borderRadius: 0 }} />
        ))}
    </Box>
);
