import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Grid, Box, useTheme, Divider,
} from '@mui/material';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { DashboardSkeleton } from './ui/SkeletonLoader';

const Dashboard = () => {
    const theme = useTheme();
    const { authHeader } = useAuth();
    const dark = theme.palette.mode === 'dark';
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, inprogress: 0, completed: 0, low: 0, medium: 0, high: 0 });
    const [dueSoon, setDueSoon] = useState([]);
    const [overdue, setOverdue] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/tasks', { headers: authHeader });
                const now = new Date();
                const soon = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
                setStats({
                    total: data.length,
                    pending: data.filter(t => t.status === 'pending').length,
                    inprogress: data.filter(t => t.status === 'in-progress').length,
                    completed: data.filter(t => t.status === 'completed').length,
                    low: data.filter(t => t.priority === 'low').length,
                    medium: data.filter(t => t.priority === 'medium').length,
                    high: data.filter(t => t.priority === 'high').length,
                });
                const active = data.filter(t => t.status !== 'completed' && t.dueDate);
                setDueSoon(active.filter(t => { const d = new Date(t.dueDate); return d >= now && d <= soon; }));
                setOverdue(active.filter(t => new Date(t.dueDate) < now));
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <DashboardSkeleton />;

    const muted = theme.palette.text.secondary;
    const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)';
    const cardBg = theme.palette.background.paper;

    const STAT_CARDS = [
        { label: 'Total', value: stats.total, accent: '#6366f1' },
        { label: 'Pending', value: stats.pending, accent: '#f59e0b' },
        { label: 'In Progress', value: stats.inprogress, accent: '#06b6d4' },
        { label: 'Completed', value: stats.completed, accent: '#10b981' },
    ];

    const pieData = [
        { name: 'Pending', value: stats.pending },
        { name: 'In Progress', value: stats.inprogress },
        { name: 'Completed', value: stats.completed },
    ];
    const PIE_COLORS = ['#f59e0b', '#6366f1', '#10b981'];

    const barData = [
        { name: 'Low', count: stats.low, fill: '#10b981' },
        { name: 'Medium', count: stats.medium, fill: '#f59e0b' },
        { name: 'High', count: stats.high, fill: '#ef4444' },
    ];

    const tooltipStyle = {
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: 6,
        fontSize: 13,
        boxShadow: 'none',
    };

    return (
        <Grid container spacing={2.5}>
            {/* Stat cards */}
            {STAT_CARDS.map(s => (
                <Grid item xs={6} sm={3} key={s.label}>
                    <Card sx={{ bgcolor: cardBg }}>
                        <CardContent sx={{ p: '16px !important' }}>
                            <Box
                                sx={{
                                    width: 28,
                                    height: 3,
                                    borderRadius: 1,
                                    bgcolor: s.accent,
                                    mb: 2,
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: 32,
                                    fontWeight: 700,
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1,
                                    fontVariantNumeric: 'tabular-nums',
                                    color: s.accent,
                                }}
                            >
                                {s.value}
                            </Typography>
                            <Typography fontSize={12} color="text.secondary" fontWeight={500} mt={0.75} letterSpacing="0.04em">
                                {s.label.toUpperCase()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}

            {/* Status pie */}
            <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: cardBg }}>
                    <CardContent>
                        <Typography fontSize={12} fontWeight={600} color="text.secondary" letterSpacing="0.06em" mb={2}>
                            STATUS DISTRIBUTION
                        </Typography>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%" cy="50%"
                                    outerRadius={72}
                                    innerRadius={40}
                                    paddingAngle={3}
                                    label={({ name, percent }) => percent > 0 ? `${name} ${Math.round(percent * 100)}%` : ''}
                                    labelLine={false}
                                >
                                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>

            {/* Priority bar */}
            <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: cardBg }}>
                    <CardContent>
                        <Typography fontSize={12} fontWeight={600} color="text.secondary" letterSpacing="0.06em" mb={2}>
                            PRIORITY BREAKDOWN
                        </Typography>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={barData} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" stroke={border} vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: muted }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                                    {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>

            {/* Due soon */}
            <Grid item xs={12} md={8}>
                <Card sx={{ bgcolor: cardBg }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography fontSize={12} fontWeight={600} color="text.secondary" letterSpacing="0.06em">
                                DUE SOON
                            </Typography>
                            <Typography fontSize={12} color="text.secondary">
                                Next 3 days · <Box component="span" fontWeight={700} color="#f59e0b">{dueSoon.length}</Box>
                            </Typography>
                        </Box>
                        {dueSoon.length === 0 ? (
                            <Typography fontSize={13} color="text.disabled" textAlign="center" py={3}>
                                No tasks due in the next 3 days
                            </Typography>
                        ) : (
                            dueSoon.map((task, i) => (
                                <Box key={task._id}>
                                    {i > 0 && <Divider sx={{ my: 1 }} />}
                                    <Box display="flex" justifyContent="space-between" alignItems="center" py={0.5}>
                                        <Typography fontSize={13} fontWeight={500} noWrap sx={{ maxWidth: '60%' }}>
                                            {task.title}
                                        </Typography>
                                        <Typography fontSize={12} color="warning.main" fontWeight={600}
                                            sx={{ fontVariantNumeric: 'tabular-nums' }}>
                                            {new Date(task.dueDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Overdue */}
            <Grid item xs={12} md={4}>
                <Card sx={{
                    bgcolor: overdue.length > 0
                        ? (dark ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.03)')
                        : cardBg,
                    borderColor: overdue.length > 0 ? 'rgba(239,68,68,0.25)' : border,
                }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <Typography
                            sx={{
                                fontSize: 52,
                                fontWeight: 700,
                                letterSpacing: '-0.05em',
                                lineHeight: 1,
                                fontVariantNumeric: 'tabular-nums',
                                color: overdue.length > 0 ? 'error.main' : 'text.disabled',
                            }}
                        >
                            {overdue.length}
                        </Typography>
                        <Typography fontSize={12} fontWeight={600} color="text.secondary" letterSpacing="0.06em" mt={1}>
                            OVERDUE
                        </Typography>
                        {overdue.length > 0 && (
                            <Typography fontSize={12} color="error.main" mt={1}>
                                Needs immediate attention
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
