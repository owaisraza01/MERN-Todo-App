import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Avatar,
    Tooltip as MuiTooltip,
    useTheme,
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inprogress: 0,
        completed: 0,
    });

    const theme = useTheme();

    // Color palettes for theme
    const COLORS_LIGHT = ['#f093fb', '#fdcb6e', '#00b894'];
    const COLORS_DARK = ['#d980fa', '#f6d365', '#26de81'];

    const statusDetails = [
        {
            name: 'Pending',
            icon: <HourglassEmptyIcon sx={{ color: theme.palette.mode === 'dark' ? '#d980fa' : '#f093fb', fontSize: 32 }} />,
            color: theme.palette.mode === 'dark' ? '#d980fa' : '#f093fb',
            key: 'pending',
        },
        {
            name: 'In Progress',
            icon: <AutorenewIcon sx={{ color: theme.palette.mode === 'dark' ? '#f6d365' : '#fdcb6e', fontSize: 32 }} />,
            color: theme.palette.mode === 'dark' ? '#f6d365' : '#fdcb6e',
            key: 'inprogress',
        },
        {
            name: 'Completed',
            icon: <CheckCircleIcon sx={{ color: theme.palette.mode === 'dark' ? '#26de81' : '#00b894', fontSize: 32 }} />,
            color: theme.palette.mode === 'dark' ? '#26de81' : '#00b894',
            key: 'completed',
        },
    ];

    useEffect(() => {
        async function fetchStats() {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const total = data.length;
            const pending = data.filter((t) => t.status === 'pending').length;
            const inprogress = data.filter((t) => t.status === 'in-progress' || t.status === 'inprogress').length;
            const completed = data.filter((t) => t.status === 'completed').length;
            setStats({ total, pending, inprogress, completed });
        }
        fetchStats();
    }, []);

    const pieData = [
        { name: 'Pending', value: stats.pending },
        { name: 'In Progress', value: stats.inprogress },
        { name: 'Completed', value: stats.completed },
    ];

    const glassBg =
        theme.palette.mode === "dark"
            ? "rgba(34, 40, 49, 0.96)"
            : "rgba(255,255,255,0.93)";
    const textColor = theme.palette.mode === 'dark' ? '#f7f7fa' : '#222';

    return (
        <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
                <Card
                    elevation={10}
                    sx={{
                        borderRadius: 5,
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
                            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: '#fff',
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 8px 32px 0 #000b'
                            : '0 6px 48px 0 rgba(240,147,251,0.12)',
                        position: 'relative',
                        overflow: 'visible',
                        minHeight: 180,
                        transition: "background 0.4s, box-shadow 0.3s",
                    }}
                >
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.mode === 'dark' ? '#232526' : '#fff',
                                    color: theme.palette.mode === 'dark' ? '#d980fa' : '#f093fb',
                                    width: 54,
                                    height: 54,
                                    boxShadow: '0 2px 12px 0 #f093fb33',
                                }}
                            >
                                <AssignmentIcon sx={{ fontSize: 34 }} />
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 900,
                                        letterSpacing: -2,
                                        lineHeight: 1,
                                        fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                        textShadow: theme.palette.mode === 'dark'
                                            ? '0 2px 12px #0008'
                                            : '0 1px 0 #fff8',
                                        color: "#fff",
                                    }}
                                >
                                    {stats.total}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.98, color: "#fff" }}>
                                    Total Tasks
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={8}>
                <Card
                    elevation={8}
                    sx={{
                        borderRadius: 5,
                        background: glassBg,
                        boxShadow: theme.palette.mode === "dark"
                            ? "0 4px 22px 0 #000b"
                            : "0 4px 28px 0 rgba(31,38,135,0.07)",
                        overflow: 'visible',
                        minHeight: 180,
                        transition: "background 0.3s, box-shadow 0.3s",
                    }}
                >
                    <CardContent>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                            flexWrap="wrap"
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 900,
                                    color: textColor,
                                    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                    letterSpacing: '-1px',
                                }}
                            >
                                Task Status Breakdown
                            </Typography>
                            <Box display="flex" gap={3} flexWrap="wrap">
                                {statusDetails.map((s) => (
                                    <Box
                                        key={s.name}
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                        sx={{ minWidth: 90 }}
                                    >
                                        <MuiTooltip title={s.name} arrow>
                                            <Box>{s.icon}</Box>
                                        </MuiTooltip>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                color: s.color,
                                                fontSize: 20,
                                                textShadow: theme.palette.mode === 'dark'
                                                    ? '0 2px 12px #0008'
                                                    : 'none',
                                            }}
                                        >
                                            {stats[s.key]}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={70}
                                    innerRadius={38}
                                    paddingAngle={3}
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        percent > 0 ? `${name} (${Math.round(percent * 100)}%)` : ''
                                    }
                                >
                                    {pieData.map((entry, idx) => (
                                        <Cell
                                            key={entry.name}
                                            fill={
                                                theme.palette.mode === 'dark'
                                                    ? COLORS_DARK[idx % COLORS_DARK.length]
                                                    : COLORS_LIGHT[idx % COLORS_LIGHT.length]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    wrapperStyle={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: textColor,
                                    }}
                                    contentStyle={{
                                        background: glassBg,
                                        border: "1.5px solid #eee",
                                        borderRadius: 10,
                                        boxShadow: "0 2px 12px #0001",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Dashboard;