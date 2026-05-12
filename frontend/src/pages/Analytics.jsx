import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography, Grid, Stack, Chip,
    Button, CircularProgress, useTheme, Divider, Avatar,
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, Cell,
} from 'recharts';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const WEEK_LABELS = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (5 - i) * 7);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

const getWeekIndex = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    const weekIdx = 5 - Math.floor(diffDays / 7);
    return weekIdx >= 0 && weekIdx <= 5 ? weekIdx : null;
};

const exportCSV = (rows, filename) => {
    const headers = ['Title', 'Status', 'Priority', 'Due Date', 'Assignees', 'Created'];
    const lines = [
        headers.join(','),
        ...rows.map(t => [
            `"${t.title.replace(/"/g, '""')}"`,
            t.status,
            t.priority,
            t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '',
            `"${(t.assignedTo || []).map(u => u.name || u.email).join('; ')}"`,
            new Date(t.createdAt).toLocaleDateString(),
        ].join(',')),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

const Analytics = () => {
    const theme = useTheme();
    const { authHeader } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const cardBg = theme.palette.mode === 'dark' ? '#1e2533' : '#fff';
    const textMuted = theme.palette.text.secondary;

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/tasks', { headers: authHeader });
            setTasks(Array.isArray(data) ? data : data.tasks || []);
        } finally {
            setLoading(false);
        }
    }, [authHeader]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    // --- Derived data ---
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    // Team productivity: completed & total per user
    const userMap = {};
    tasks.forEach(t => {
        (t.assignedTo || []).forEach(u => {
            if (!u._id) return;
            if (!userMap[u._id]) userMap[u._id] = { name: u.name || u.email || 'Unknown', total: 0, completed: 0 };
            userMap[u._id].total++;
            if (t.status === 'completed') userMap[u._id].completed++;
        });
    });
    const teamData = Object.values(userMap)
        .sort((a, b) => b.completed - a.completed)
        .slice(0, 8);
    const topUser = teamData[0];

    // Creation trend: tasks created per week (last 6 weeks)
    const trendData = WEEK_LABELS.map((label, i) => ({ week: label, created: 0, completed: 0 }));
    tasks.forEach(t => {
        const wi = getWeekIndex(t.createdAt);
        if (wi !== null) {
            trendData[wi].created++;
            if (t.status === 'completed') trendData[wi].completed++;
        }
    });

    // Priority distribution
    const priorityData = [
        { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, fill: '#43e97b' },
        { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, fill: '#fdcb6e' },
        { name: 'High', value: tasks.filter(t => t.priority === 'high').length, fill: '#e17055' },
    ];

    return (
        <Box>
            {/* Header */}
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" gap={1}>
                            <BarChartRoundedIcon color="primary" />
                            <Typography variant="h6" fontWeight={800} color="primary">Analytics</Typography>
                        </Stack>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadRoundedIcon />}
                            onClick={() => exportCSV(tasks, 'taskflow-all-tasks.csv')}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            Export All CSV
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {/* Summary stats */}
                {[
                    { label: 'Total Tasks', value: tasks.length, color: '#667eea' },
                    { label: 'Completion Rate', value: `${completionRate}%`, color: '#43e97b' },
                    { label: 'Overdue', value: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length, color: '#e17055' },
                    { label: 'Team Members', value: Object.keys(userMap).length, color: '#4facfe' },
                ].map(s => (
                    <Grid item xs={6} md={3} key={s.label}>
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: cardBg }}>
                            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                                <Typography variant="h3" fontWeight={900} sx={{ color: s.color }}>{s.value}</Typography>
                                <Typography fontSize={13} color="text.secondary" fontWeight={600}>{s.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {/* Task creation & completion trend */}
                <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: cardBg }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" gap={1} mb={2}>
                                <TrendingUpRoundedIcon fontSize="small" color="primary" />
                                <Typography variant="subtitle1" fontWeight={700}>6-Week Task Trend</Typography>
                            </Stack>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            background: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 8,
                                            fontSize: 13,
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: 13 }} />
                                    <Line type="monotone" dataKey="created" stroke="#4facfe" strokeWidth={2.5} dot={{ r: 4 }} name="Created" />
                                    <Line type="monotone" dataKey="completed" stroke="#43e97b" strokeWidth={2.5} dot={{ r: 4 }} name="Completed" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Priority distribution */}
                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: cardBg, height: '100%' }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={700} mb={2}>Priority Split</Typography>
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={priorityData} barSize={36}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: textMuted }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            background: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 8,
                                            fontSize: 13,
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Tasks">
                                        {priorityData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Team productivity */}
                <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: cardBg }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={700} mb={2}>Team Productivity</Typography>
                            {teamData.length === 0 ? (
                                <Typography variant="body2" color="text.disabled" textAlign="center" py={4}>
                                    No tasks assigned to team members yet
                                </Typography>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={teamData} barSize={28} barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 11, fill: textMuted }}
                                            axisLine={false}
                                            tickLine={false}
                                            interval={0}
                                            tickFormatter={v => v.split(' ')[0]}
                                        />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                background: theme.palette.background.paper,
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 8,
                                                fontSize: 13,
                                            }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: 13 }} />
                                        <Bar dataKey="total" fill="#4facfe" radius={[4, 4, 0, 0]} name="Assigned" />
                                        <Bar dataKey="completed" fill="#43e97b" radius={[4, 4, 0, 0]} name="Completed" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top performer */}
                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: cardBg, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <EmojiEventsRoundedIcon sx={{ fontSize: 44, color: '#fdcb6e', mb: 1 }} />
                            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={2}>
                                Top Performer
                            </Typography>
                            {topUser ? (
                                <>
                                    <Avatar
                                        sx={{
                                            width: 56, height: 56, fontSize: 22, fontWeight: 700, mx: 'auto', mb: 1.5,
                                            background: 'linear-gradient(135deg, #6dd5ed, #2193b0)',
                                        }}
                                    >
                                        {topUser.name[0].toUpperCase()}
                                    </Avatar>
                                    <Typography fontWeight={800} fontSize={17}>{topUser.name}</Typography>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Stack direction="row" justifyContent="center" spacing={2}>
                                        <Box textAlign="center">
                                            <Typography fontWeight={900} fontSize={22} color="success.main">{topUser.completed}</Typography>
                                            <Typography fontSize={11} color="text.secondary">Completed</Typography>
                                        </Box>
                                        <Box textAlign="center">
                                            <Typography fontWeight={900} fontSize={22}>{topUser.total}</Typography>
                                            <Typography fontSize={11} color="text.secondary">Assigned</Typography>
                                        </Box>
                                        <Box textAlign="center">
                                            <Typography fontWeight={900} fontSize={22} color="primary.main">
                                                {Math.round((topUser.completed / topUser.total) * 100)}%
                                            </Typography>
                                            <Typography fontSize={11} color="text.secondary">Rate</Typography>
                                        </Box>
                                    </Stack>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.disabled">No assigned tasks yet</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;
