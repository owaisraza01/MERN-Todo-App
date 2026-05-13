import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Grid, Button, CircularProgress, useTheme } from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, Cell,
} from 'recharts';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/layout/PageHeader';
import { tokens } from '../theme/theme';

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
            t.status, t.priority,
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

const Tile = ({ title, tag, children, sx = {} }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    return (
        <Box
            sx={{
                border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,10,13,0.08)'}`,
                bgcolor: 'background.paper',
                p: 3,
                height: '100%',
                ...sx,
            }}
        >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: tokens.accent, letterSpacing: '0.1em', fontWeight: 600 }}>
                    {tag}
                </Box>
                <Box sx={{ height: 1, width: 16, bgcolor: 'divider' }} />
                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'text.secondary' }}>
                    {title}
                </Typography>
            </Box>
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
        background: dark ? '#111114' : '#fff',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(10,10,13,0.1)'}`,
        borderRadius: 2,
        fontSize: 11,
        fontFamily: tokens.fontMono,
        boxShadow: 'none',
        color: dark ? '#f5f5f4' : '#0a0a0d',
    };
    const tooltipItemStyle = { color: dark ? '#f5f5f4' : '#0a0a0d', fontFamily: tokens.fontMono, fontSize: 11 };
    const tooltipLabelStyle = { color: dark ? '#a1a1aa' : '#52525b', fontFamily: tokens.fontMono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 };

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/tasks', { headers: authHeader });
            setTasks(Array.isArray(data) ? data : data.tasks || []);
        } finally { setLoading(false); }
    }, [authHeader]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    const completedTasks = tasks.filter(t => t.status === 'completed');
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed');
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    const userMap = {};
    tasks.forEach(t => {
        (t.assignedTo || []).forEach(u => {
            if (!u._id) return;
            if (!userMap[u._id]) userMap[u._id] = { name: u.name || u.email || '—', total: 0, completed: 0 };
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
        { name: 'LOW',  value: tasks.filter(t => t.priority === 'low').length, fill: '#22c55e' },
        { name: 'MED',  value: tasks.filter(t => t.priority === 'medium').length, fill: '#f59e0b' },
        { name: 'HIGH', value: tasks.filter(t => t.priority === 'high').length, fill: '#f43f5e' },
    ];

    const statCards = [
        { tag: '◆', label: 'TOTAL',      value: tasks.length,                   color: 'text.primary' },
        { tag: '◇', label: 'COMPLETION', value: `${completionRate}%`,           color: tokens.accent },
        { tag: '!', label: 'OVERDUE',    value: overdueTasks.length,             color: '#f43f5e' },
        { tag: '◯', label: 'TEAM',       value: Object.keys(userMap).length,    color: '#06b6d4' },
    ];

    return (
        <>
            <PageHeader
                index="03"
                title="Analytics"
                subtitle="Six-week trend lines, team productivity, completion velocity. Export the raw dataset anytime."
                actions={
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadRoundedIcon sx={{ fontSize: 14 }} />}
                        onClick={() => exportCSV(tasks, 'taskflow-all-tasks.csv')}
                    >
                        Export CSV
                    </Button>
                }
            />

            <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 } }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                        <CircularProgress size={24} sx={{ color: tokens.accent }} />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {/* Stat cards */}
                        {statCards.map(s => (
                            <Grid item xs={6} sm={3} key={s.label}>
                                <Tile tag={s.tag} title={s.label}>
                                    <Typography
                                        sx={{
                                            fontFamily: tokens.fontDisplay,
                                            fontWeight: 700,
                                            fontSize: 44,
                                            letterSpacing: '-0.04em',
                                            lineHeight: 0.9,
                                            color: s.color,
                                            fontVariantNumeric: 'tabular-nums',
                                        }}
                                    >
                                        {s.value}
                                    </Typography>
                                </Tile>
                            </Grid>
                        ))}

                        {/* Trend */}
                        <Grid item xs={12} md={8}>
                            <Tile tag="↗" title="6-Week Trend">
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="2 4" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(10,10,13,0.06)'} vertical={false} />
                                        <XAxis dataKey="week" tick={{ fontSize: 10, fill: textMuted, fontFamily: tokens.fontMono }} axisLine={false} tickLine={false} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: textMuted, fontFamily: tokens.fontMono }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                                        <Legend wrapperStyle={{ fontSize: 11, fontFamily: tokens.fontMono, letterSpacing: '0.06em', textTransform: 'uppercase' }} />
                                        <Line type="monotone" dataKey="created" stroke={tokens.accent} strokeWidth={2} dot={{ r: 3, fill: tokens.accent }} name="Created" />
                                        <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} name="Completed" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Tile>
                        </Grid>

                        {/* Priority */}
                        <Grid item xs={12} md={4}>
                            <Tile tag="◐" title="Priority Split">
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={priorityData} barSize={36}>
                                        <CartesianGrid strokeDasharray="2 4" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(10,10,13,0.06)'} vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: textMuted, fontFamily: tokens.fontMono, letterSpacing: 1 }} axisLine={false} tickLine={false} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: textMuted, fontFamily: tokens.fontMono }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                                        <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                                            {priorityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Tile>
                        </Grid>

                        {/* Team productivity */}
                        <Grid item xs={12} md={8}>
                            <Tile tag="◌" title="Team Productivity">
                                {teamData.length === 0 ? (
                                    <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: 'text.disabled', textAlign: 'center', py: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                        — No assignments yet —
                                    </Typography>
                                ) : (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={teamData} barSize={20} barGap={3}>
                                            <CartesianGrid strokeDasharray="2 4" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(10,10,13,0.06)'} vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: textMuted, fontFamily: tokens.fontMono }} axisLine={false} tickLine={false} interval={0} tickFormatter={v => v.split(' ')[0]} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: textMuted, fontFamily: tokens.fontMono }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                                            <Legend wrapperStyle={{ fontSize: 11, fontFamily: tokens.fontMono, letterSpacing: '0.06em', textTransform: 'uppercase' }} />
                                            <Bar dataKey="total" fill={dark ? '#3f3f46' : '#a1a1aa'} radius={[0, 0, 0, 0]} name="Assigned" />
                                            <Bar dataKey="completed" fill={tokens.accent} radius={[0, 0, 0, 0]} name="Completed" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Tile>
                        </Grid>

                        {/* Top performer */}
                        <Grid item xs={12} md={4}>
                            <Tile tag="★" title="Top Performer">
                                {topUser ? (
                                    <Box>
                                        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: 'text.secondary', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.5 }}>
                                            // {topUser.name}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: tokens.fontDisplay,
                                                fontWeight: 700,
                                                fontSize: 56,
                                                letterSpacing: '-0.04em',
                                                lineHeight: 0.9,
                                                color: tokens.accent,
                                                fontVariantNumeric: 'tabular-nums',
                                            }}
                                        >
                                            {Math.round((topUser.completed / topUser.total) * 100)}%
                                        </Typography>
                                        <Box sx={{ mt: 2, height: 2, bgcolor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,13,0.06)', position: 'relative' }}>
                                            <Box sx={{ position: 'absolute', inset: 0, width: `${Math.round((topUser.completed / topUser.total) * 100)}%`, bgcolor: tokens.accent }} />
                                        </Box>
                                        <Box mt={2} display="flex" justifyContent="space-between">
                                            <Box>
                                                <Typography sx={{ fontFamily: tokens.fontDisplay, fontSize: 22, fontWeight: 700, color: '#22c55e', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                                                    {topUser.completed}
                                                </Typography>
                                                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.secondary', letterSpacing: '0.1em' }}>
                                                    DONE
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontFamily: tokens.fontDisplay, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                                                    {topUser.total}
                                                </Typography>
                                                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.secondary', letterSpacing: '0.1em' }}>
                                                    TOTAL
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: 'text.disabled', textAlign: 'center', py: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                        — No data —
                                    </Typography>
                                )}
                            </Tile>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </>
    );
};

export default Analytics;
