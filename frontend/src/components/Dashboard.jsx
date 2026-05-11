import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Grid, Box, Chip, useTheme, Divider,
} from '@mui/material';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import axios from 'axios';
import { DashboardSkeleton } from './ui/SkeletonLoader';

const STAT_CARDS = [
    {
        key: 'total',
        label: 'Total Tasks',
        icon: AssignmentRoundedIcon,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        key: 'pending',
        label: 'Pending',
        icon: HourglassEmptyRoundedIcon,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
        key: 'inprogress',
        label: 'In Progress',
        icon: AutorenewRoundedIcon,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
        key: 'completed',
        label: 'Completed',
        icon: CheckCircleRoundedIcon,
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
];

const PIE_COLORS = ['#f5576c', '#4facfe', '#43e97b'];
const BAR_COLORS = { low: '#43e97b', medium: '#fdcb6e', high: '#e17055' };

const Dashboard = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, inprogress: 0, completed: 0, low: 0, medium: 0, high: 0 });
    const [dueSoon, setDueSoon] = useState([]);
    const [overdue, setOverdue] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/api/tasks', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const now = new Date();
                const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

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
                setDueSoon(active.filter(t => {
                    const d = new Date(t.dueDate);
                    return d >= now && d <= threeDaysLater;
                }));
                setOverdue(active.filter(t => new Date(t.dueDate) < now));
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <DashboardSkeleton />;

    const pieData = [
        { name: 'Pending', value: stats.pending },
        { name: 'In Progress', value: stats.inprogress },
        { name: 'Completed', value: stats.completed },
    ];

    const barData = [
        { name: 'Low', count: stats.low, fill: BAR_COLORS.low },
        { name: 'Medium', count: stats.medium, fill: BAR_COLORS.medium },
        { name: 'High', count: stats.high, fill: BAR_COLORS.high },
    ];

    const cardBg = theme.palette.mode === 'dark' ? '#1e2533' : '#ffffff';
    const textMuted = theme.palette.text.secondary;

    return (
        <Grid container spacing={3}>
            {STAT_CARDS.map(({ key, label, icon: Icon, gradient }) => (
                <Grid item xs={6} md={3} key={key}>
                    <Card
                        elevation={0}
                        sx={{
                            background: gradient,
                            color: '#fff',
                            borderRadius: 3,
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <CardContent sx={{ pb: '16px !important' }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: -12,
                                    top: -12,
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.12)',
                                }}
                            />
                            <Icon sx={{ fontSize: 32, opacity: 0.9, mb: 1 }} />
                            <Typography variant="h3" fontWeight={900} lineHeight={1}>
                                {stats[key]}
                            </Typography>
                            <Typography fontSize={13} fontWeight={600} sx={{ opacity: 0.9, mt: 0.5 }}>
                                {label}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}

            <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ background: cardBg, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                            Status Breakdown
                        </Typography>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    innerRadius={45}
                                    paddingAngle={3}
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        percent > 0 ? `${name} ${Math.round(percent * 100)}%` : ''
                                    }
                                >
                                    {pieData.map((_, idx) => (
                                        <Cell key={idx} fill={PIE_COLORS[idx]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 8,
                                        fontSize: 13,
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ background: cardBg, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                            Priority Breakdown
                        </Typography>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={barData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 13, fill: textMuted }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: textMuted }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(33,147,176,0.06)' }}
                                    contentStyle={{
                                        background: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 8,
                                        fontSize: 13,
                                    }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                    {barData.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={8}>
                <Card elevation={0} sx={{ background: cardBg, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <WarningAmberRoundedIcon sx={{ color: '#fdcb6e' }} />
                            <Typography variant="subtitle1" fontWeight={700}>
                                Due Soon
                            </Typography>
                            <Chip label={dueSoon.length} size="small" sx={{ bgcolor: '#fdcb6e22', color: '#fdcb6e', fontWeight: 700 }} />
                        </Box>
                        {dueSoon.length === 0 ? (
                            <Typography variant="body2" color="text.disabled" sx={{ py: 2, textAlign: 'center' }}>
                                No tasks due in the next 3 days
                            </Typography>
                        ) : (
                            dueSoon.map((task, i) => (
                                <Box key={task._id}>
                                    {i > 0 && <Divider sx={{ my: 1 }} />}
                                    <Box display="flex" justifyContent="space-between" alignItems="center" py={0.5}>
                                        <Typography fontSize={14} fontWeight={600} noWrap sx={{ maxWidth: '60%' }}>
                                            {task.title}
                                        </Typography>
                                        <Typography fontSize={12} color="warning.main" fontWeight={600}>
                                            {new Date(task.dueDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: overdue.length > 0 ? 'error.light' : 'divider',
                        background: overdue.length > 0
                            ? theme.palette.mode === 'dark' ? 'rgba(231,76,60,0.1)' : 'rgba(231,76,60,0.04)'
                            : cardBg,
                        height: '100%',
                    }}
                >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <EventBusyRoundedIcon
                            sx={{
                                fontSize: 48,
                                color: overdue.length > 0 ? 'error.main' : 'text.disabled',
                                mb: 1,
                            }}
                        />
                        <Typography
                            variant="h2"
                            fontWeight={900}
                            color={overdue.length > 0 ? 'error.main' : 'text.disabled'}
                        >
                            {overdue.length}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                            Overdue Tasks
                        </Typography>
                        {overdue.length > 0 && (
                            <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
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
