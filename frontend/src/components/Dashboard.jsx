import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { DashboardSkeleton } from './ui/SkeletonLoader';
import PageHeader from './layout/PageHeader';
import { tokens } from '../theme/theme';

const Tile = ({ children, sx = {}, span = {} }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    return (
        <Box
            sx={{
                border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,10,13,0.08)'}`,
                bgcolor: 'background.paper',
                p: { xs: 2.5, md: 3 },
                position: 'relative',
                overflow: 'hidden',
                gridColumn: span.col,
                gridRow: span.row,
                ...sx,
            }}
        >
            {children}
        </Box>
    );
};

const TileLabel = ({ tag, label }) => (
    <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Box sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: tokens.accent, letterSpacing: '0.1em', fontWeight: 600 }}>
            {tag}
        </Box>
        <Box sx={{ height: 1, width: 16, bgcolor: 'divider' }} />
        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'text.secondary' }}>
            {label}
        </Typography>
    </Box>
);

const Dashboard = () => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const { authHeader } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, inprogress: 0, completed: 0, low: 0, medium: 0, high: 0 });
    const [dueSoon, setDueSoon] = useState([]);
    const [overdue, setOverdue] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/tasks', { headers: authHeader });
                const tasks = Array.isArray(data) ? data : data.tasks || [];
                const now = new Date();
                const soon = new Date(now.getTime() + 3 * 86400000);
                setStats({
                    total: tasks.length,
                    pending: tasks.filter(t => t.status === 'pending').length,
                    inprogress: tasks.filter(t => t.status === 'in-progress').length,
                    completed: tasks.filter(t => t.status === 'completed').length,
                    low: tasks.filter(t => t.priority === 'low').length,
                    medium: tasks.filter(t => t.priority === 'medium').length,
                    high: tasks.filter(t => t.priority === 'high').length,
                });
                const active = tasks.filter(t => t.status !== 'completed' && t.dueDate);
                setDueSoon(active.filter(t => { const d = new Date(t.dueDate); return d >= now && d <= soon; }));
                setOverdue(active.filter(t => new Date(t.dueDate) < now));
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const muted = theme.palette.text.secondary;
    const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    const pieData = [
        { name: 'Pending',     value: stats.pending,    fill: '#f59e0b' },
        { name: 'In Progress', value: stats.inprogress, fill: tokens.accent },
        { name: 'Completed',   value: stats.completed,  fill: '#22c55e' },
    ];

    const barData = [
        { name: 'LOW',  count: stats.low,    fill: '#22c55e' },
        { name: 'MED',  count: stats.medium, fill: '#f59e0b' },
        { name: 'HIGH', count: stats.high,   fill: '#f43f5e' },
    ];

    const tooltipStyle = {
        background: dark ? '#111114' : '#ffffff',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(10,10,13,0.1)'}`,
        borderRadius: 2,
        fontSize: 11,
        fontFamily: tokens.fontMono,
        boxShadow: 'none',
        color: dark ? '#f5f5f4' : '#0a0a0d',
    };
    const tooltipItemStyle = { color: dark ? '#f5f5f4' : '#0a0a0d', fontFamily: tokens.fontMono, fontSize: 11 };
    const tooltipLabelStyle = { color: dark ? '#a1a1aa' : '#52525b', fontFamily: tokens.fontMono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 };

    return (
        <>
            <PageHeader
                index="01"
                title="Dashboard"
                subtitle="Live operational overview of your task pipeline, team performance, and upcoming deadlines."
            />

            <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 } }}>
                {loading ? <DashboardSkeleton /> : (
                    <Box
                        sx={{
                            display: 'grid',
                            gap: 2,
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' },
                            gridAutoRows: { xs: 'auto', sm: 'minmax(140px, auto)' },
                        }}
                    >
                        {/* HERO: massive total */}
                        <Tile span={{ col: { sm: 'span 4', lg: 'span 4' }, row: { sm: 'span 2' } }}>
                            <TileLabel tag="◆" label="Total Tasks Tracked" />
                            <Box display="flex" alignItems="flex-end" gap={3} flexWrap="wrap">
                                <Typography
                                    sx={{
                                        fontFamily: tokens.fontDisplay,
                                        fontWeight: 700,
                                        fontSize: { xs: 96, md: 140 },
                                        letterSpacing: '-0.06em',
                                        lineHeight: 0.85,
                                        color: 'text.primary',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {String(stats.total).padStart(2, '0')}
                                </Typography>
                                <Box pb={1.5}>
                                    <Box display="flex" alignItems="center" gap={0.75} mb={1}>
                                        <Box sx={{ width: 8, height: 8, bgcolor: tokens.accent }} />
                                        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, fontWeight: 600, color: tokens.accent, letterSpacing: '0.08em' }}>
                                            {completionPct}% COMPLETE
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: 12, color: 'text.secondary', fontFamily: tokens.fontMono, letterSpacing: '0.04em' }}>
                                        {stats.completed} of {stats.total} done
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Progress bar */}
                            <Box sx={{ mt: 3, height: 2, bgcolor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,13,0.06)', position: 'relative' }}>
                                <Box sx={{ position: 'absolute', inset: 0, width: `${completionPct}%`, bgcolor: tokens.accent }} />
                            </Box>

                            {/* Mini breakdown row */}
                            <Box mt={3} display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
                                {[
                                    { label: 'PENDING',   value: stats.pending,    color: '#f59e0b' },
                                    { label: 'ACTIVE',    value: stats.inprogress, color: tokens.accent },
                                    { label: 'DONE',      value: stats.completed,  color: '#22c55e' },
                                ].map(item => (
                                    <Box key={item.label}>
                                        <Typography sx={{ fontFamily: tokens.fontDisplay, fontSize: 24, fontWeight: 700, color: item.color, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
                                            {item.value}
                                        </Typography>
                                        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 9.5, color: 'text.secondary', letterSpacing: '0.12em', fontWeight: 500 }}>
                                            {item.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Tile>

                        {/* OVERDUE alert tile */}
                        <Tile
                            span={{ col: { sm: 'span 2', lg: 'span 2' }, row: { sm: 'span 1' } }}
                            sx={{
                                bgcolor: overdue.length > 0 ? (dark ? 'rgba(244,63,94,0.08)' : 'rgba(244,63,94,0.05)') : 'background.paper',
                                borderColor: overdue.length > 0 ? 'rgba(244,63,94,0.3)' : undefined,
                            }}
                        >
                            <TileLabel tag="!" label="Overdue" />
                            <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 700, fontSize: 56, letterSpacing: '-0.04em', lineHeight: 0.9, color: overdue.length > 0 ? '#f43f5e' : 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>
                                {String(overdue.length).padStart(2, '0')}
                            </Typography>
                            <Typography sx={{ mt: 1, fontFamily: tokens.fontMono, fontSize: 10.5, color: overdue.length > 0 ? '#f43f5e' : 'text.disabled', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                {overdue.length > 0 ? 'Action required →' : '— All on schedule —'}
                            </Typography>
                        </Tile>

                        {/* Priority bar chart */}
                        <Tile span={{ col: { sm: 'span 2', lg: 'span 2' }, row: { sm: 'span 1' } }}>
                            <TileLabel tag="◐" label="Priority" />
                            <Box sx={{ height: 90, mt: 1 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} barSize={24}>
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: muted, fontFamily: tokens.fontMono, letterSpacing: 1 }} axisLine={false} tickLine={false} />
                                        <YAxis hide />
                                        <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: dark ? 'rgba(255,255,255,0.03)' : 'rgba(10,10,13,0.03)' }} />
                                        <Bar dataKey="count" radius={[0, 0, 0, 0]}>
                                            {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Tile>

                        {/* Status pie */}
                        <Tile span={{ col: { sm: 'span 2', lg: 'span 3' }, row: { sm: 'span 2' } }}>
                            <TileLabel tag="◯" label="Status Distribution" />
                            <Box sx={{ height: 200 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%" cy="50%"
                                            outerRadius={78}
                                            innerRadius={50}
                                            paddingAngle={2}
                                            stroke="none"
                                        >
                                            {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                            <Box mt={1} display="flex" gap={2} flexWrap="wrap">
                                {pieData.map(d => (
                                    <Box key={d.name} display="flex" alignItems="center" gap={0.75}>
                                        <Box sx={{ width: 8, height: 8, bgcolor: d.fill }} />
                                        <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.secondary', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                            {d.name} <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>{d.value}</Box>
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Tile>

                        {/* Due soon */}
                        <Tile span={{ col: { sm: 'span 4', lg: 'span 3' }, row: { sm: 'span 2' } }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                <TileLabel tag="→" label="Due Within 72H" />
                                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>
                                    {String(dueSoon.length).padStart(2, '0')}
                                </Typography>
                            </Box>

                            {dueSoon.length === 0 ? (
                                <Box py={4} textAlign="center">
                                    <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: 'text.disabled', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                        — Clear horizon —
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ maxHeight: 240, overflowY: 'auto' }}>
                                    {dueSoon.map((task, i) => (
                                        <Box
                                            key={task._id}
                                            sx={{
                                                display: 'flex', alignItems: 'center', gap: 1.5,
                                                py: 1.25, borderTop: i > 0 ? `1px solid ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(10,10,13,0.05)'}` : 'none',
                                            }}
                                        >
                                            <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.disabled', minWidth: 24, letterSpacing: '0.05em' }}>
                                                {String(i + 1).padStart(2, '0')}
                                            </Typography>
                                            <Typography fontSize={13} fontWeight={500} noWrap sx={{ flex: 1 }}>
                                                {task.title}
                                            </Typography>
                                            <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: '#f59e0b', fontWeight: 600, letterSpacing: '0.04em' }}>
                                                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Tile>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default Dashboard;
