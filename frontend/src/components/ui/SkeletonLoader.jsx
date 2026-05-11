import React from 'react';
import { Box, Skeleton, Grid, Card, CardContent } from '@mui/material';

export const DashboardSkeleton = () => (
    <Grid container spacing={3}>
        {[...Array(4)].map((_, i) => (
            <Grid item xs={6} md={3} key={i}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Skeleton variant="circular" width={44} height={44} sx={{ mb: 1.5 }} />
                        <Skeleton variant="text" width="45%" height={44} />
                        <Skeleton variant="text" width="65%" />
                    </CardContent>
                </Card>
            </Grid>
        ))}
        {[...Array(2)].map((_, i) => (
            <Grid item xs={12} md={6} key={`chart-${i}`}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
);

export const TaskTableSkeleton = () => (
    <Box>
        <Skeleton variant="rectangular" height={48} sx={{ mb: 2, borderRadius: 2 }} />
        {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={54} sx={{ mb: 1, borderRadius: 1.5 }} />
        ))}
    </Box>
);
