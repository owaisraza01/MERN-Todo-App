import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Typography, Grid, Stack, Button, CircularProgress, Avatar, useTheme, Divider,
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, Cell,
} from 'recharts';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const WEEK_LABELS = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (5 - i) * 7);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

const getWeekIndex = dateStr => {
    const diffDays = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
    const wi = 5 - Math.floor(diffDays / 7);
    return wi >= 0 && wi <= 5 ? wi : null;
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
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
};

const ChartCard = ({ title, children }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    return (
        <Box
            sx={{
                border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.09)'}`,
                borderRadius: 1.5,
                p: 2.5,
                bgcolor: 'background.paper',
                height: '100%',
            }}
        >
            <Typography fontSize={11} fontWeight={700} letterSpacing="0.06em" color="text.disabled" mb={2}>
                {title}
            </Typography>
            {children}
        </Box>
    );
};

const Analytics = () => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const { authHeader } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const textMuted = theme.palette.text.secondary;
    const tooltipStyle = {
        background: dark ? '#0d1424' : '#fff',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.1)'}`,
        borderRadius: 6,
        fontSize: 12,
        boxShadow: 'none',
    };

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
                <CircularProgress size={28} />
            </Box>
        );
    }

    const completedTasks = tasks.filter(t => t.status === 'completed');
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed');
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    const userMap = {};
    tasks.forEach(t => {
        (t.assignedTo || []).forEach(u => {
            if (!u._id) return;
            if (!userMap[u._id]) userMap[u._id] = { name: u.name || u.email || 'Unknown', total: 0, completed: 0 };
            userMap[u._id].total++;
            if (t.status === 'completed') userMap[u._id].completed++;
        });
    });
    const teamData = Object.values(userMap).sort((a, b) => b.completed - a.completed).slice(0, 8);
    const topUser = teamData[0];

    const trendData = WEEK_LABELS.map(label => ({ week: label, created: 0, completed: 0 }));
    tasks.forEach(t => {
        const wi = getWeekIndex(t.createdAt);
        if (wi !== null) {
            trendData[wi].created++;
            if (t.status === 'completed') trendData[wi].completed++;
        }
    });

    const priorityData = [
        { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, fill: '#10b981' },
        { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, fill: '#f59e0b' },
        { name: 'High', value: tasks.filter(t => t.priority === 'high').length, fill: '#ef4444' },
    ];

    const statCards = [
        { label: 'TOTAL TASKS', value: tasks.length, color: '#6366f1' },
        { label: 'COMPLETION', value: `${completionRate}%`, color: '#10b981' },
        { label: 'OVERDUE', value: overdueTasks.length, color: '#ef4444' },
        { label: 'TEAM SIZE', value: Object.keys(userMap).length, color: '#f59e0b' },
    ];

    return (
        <Box>
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography fontSize={11} fontWeight={700} letterSpacing="0.06em" color="text.disabled">
                    ANALYTICS
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadRoundedIcon sx={{ fontSize: 14 }} />}
                    onClick={() => exportCSV(tasks, 'taskflow-all-tasks.csv')}
                    sx={{ fontSize: 12, fontWeight: 600 }}
                >
                    Export CSV
                </Button>
            </Box>

            <Grid container spacing={2}>
                {/* Stat cards */}
                {statCards.map(s => (
                    <Grid item xs={6} sm={3} key={s.label}>
                        <Box
                            sx={{
                                border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.09)'}`,
                                borderTop: `3px solid ${s.color}`,
                                borderRadius: 1.5,
                                p: 2,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <Typography
                                fontSize={28}
                                fontWeight={800}
                                lineHeight={1}
                                mb={0.75}
                                sx={{ fontVariantNumeric: 'tabular-nums', color: s.color }}
                            >
                                {s.value}
                            </Typography>
                            <Typography fontSize={11} fontWeight={600} letterSpacing="0.05em" color="text.disabled">
                                {s.label}
                            </Typography>
                        </Box>
                    </Grid>
                ))}

                {/* Trend line chart */}
                <Grid item xs={12} md={8}>
                    <ChartCard title="6-WEEK TASK TREND">
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)'} vertical={false} />
                                <XAxis dataKey="week" tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Line type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} name="Created" />
                                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} name="Completed" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                {/* Priority split */}
                <Grid item xs={12} md={4}>
                    <ChartCard title="PRIORITY SPLIT">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={priorityData} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)'} vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: textMuted }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Tasks">
                                    {priorityData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                {/* Team productivity */}
                <Grid item xs={12} md={8}>
                    <ChartCard title="TEAM PRODUCTIVITY">
                        {teamData.length === 0 ? (
                            <Typography fontSize={13} color="text.disabled" textAlign="center" py={6}>
                                No tasks assigned yet
                            </Typography>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={teamData} barSize={22} barGap={3}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)'} vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11, fill: textMuted }}
                                        axisLine={false}
                                        tickLine={false}
                                        interval={0}
                                        tickFormatter={v => v.split(' ')[0]}
                                    />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Bar dataKey="total" fill="#6366f1" radius={[3, 3, 0, 0]} name="Assigned" />
                                    <Bar dataKey="completed" fill="#10b981" radius={[3, 3, 0, 0]} name="Completed" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </ChartCard>
                </Grid>

                {/* Top performer */}
                <Grid item xs={12} md={4}>
                    <ChartCard title="TOP PERFORMER">
                        {topUser ? (
                            <Box textAlign="center" pt={1}>
                                <Avatar
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        fontSize: 20,
                                        fontWeight: 700,
                                        bgcolor: '#6366f1',
                                        mx: 'auto',
                                        mb: 1.5,
                                    }}
                                >
                                    {topUser.name[0].toUpperCase()}
                                </Avatar>
                                <Typography fontWeight={700} fontSize={15} mb={0.25}>
                                    {topUser.name}
                                </Typography>
                                <Typography fontSize={12} color="text.secondary" mb={2}>
                                    {Math.round((topUser.completed / topUser.total) * 100)}% completion rate
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Stack direction="row" justifyContent="center" spacing={3}>
                                    <Box textAlign="center">
                                        <Typography fontWeight={800} fontSize={20} sx={{ fontVariantNumeric: 'tabular-nums', color: '#10b981' }}>
                                            {topUser.completed}
                                        </Typography>
                                        <Typography fontSize={11} color="text.disabled">Done</Typography>
                                    </Box>
                                    <Box textAlign="center">
                                        <Typography fontWeight={800} fontSize={20} sx={{ fontVariantNumeric: 'tabular-nums' }}>
                                            {topUser.total}
                                        </Typography>
                                        <Typography fontSize={11} color="text.disabled">Total</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        ) : (
                            <Typography fontSize={13} color="text.disabled" textAlign="center" py={6}>
                                No data yet
                            </Typography>
                        )}
                    </ChartCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;
