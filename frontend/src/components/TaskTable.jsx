import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody,
    Chip, Stack, Box, Avatar, Tooltip, IconButton, useTheme, TableContainer, Paper
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TaskFormDialog from './TaskFormDialog';
import TaskDetailsDialog from './TaskDetailsDialog';
import axios from 'axios';

const statusColors = {
    pending: 'warning',
    'in-progress': 'info',
    inprogress: 'info',
    completed: 'success',
};

const priorityColors = {
    low: 'default',
    medium: 'warning',
    high: 'error',
};

const TaskTable = () => {
    const [tasks, setTasks] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [detailsTask, setDetailsTask] = useState(null);
    const theme = useTheme();

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/tasks', {
            headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(data);
    };

    useEffect(() => { fetchTasks(); }, []);

    const handleEdit = (task) => {
        setEditTask(task);
        setOpenForm(true);
    };

    const handleShowDetails = (task) => setDetailsTask(task);

    const handleFormClose = (refresh = false) => {
        setOpenForm(false);
        setEditTask(null);
        if (refresh) fetchTasks();
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm('Delete this task?')) return;
        const token = localStorage.getItem('token');
        await axios.delete(`/api/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchTasks();
    };

    // Theme-adaptive backgrounds
    const glassBg = theme.palette.mode === 'dark'
        ? 'rgba(34, 40, 49, 0.97)'
        : 'rgba(255,255,255,0.93)';
    const tableBg = theme.palette.mode === 'dark'
        ? 'rgba(44,62,80,0.93)'
        : 'rgba(255,255,255,0.97)';
    const assigneeBg = theme.palette.mode === 'dark'
        ? theme.palette.grey[900]
        : '#f8fbff';

    return (
        <Card
            elevation={8}
            sx={{
                my: 2,
                borderRadius: 1,
                background: glassBg,
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 36px 0 #000b'
                    : '0 6px 28px 0 rgba(31, 38, 135, 0.08)',
                transition: "background 0.4s, box-shadow 0.3s",
            }}
        >
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography
                        variant="h5"
                        fontWeight={900}
                        color="primary"
                        sx={{ letterSpacing: '-1px', fontFamily: '"Inter", "Roboto", Arial, sans-serif' }}
                    >
                        Tasks
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddTaskIcon />}
                        onClick={() => setOpenForm(true)}
                        sx={{
                            borderRadius: 1,
                            fontWeight: 700,
                            fontSize: 15,
                            py: 1.1,
                            background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                            boxShadow: '0 2px 8px 0 rgba(33,147,176,0.10)',
                            textTransform: 'none',
                            transition: 'background 0.3s',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)',
                            },
                        }}
                    >
                        Add Task
                    </Button>
                </Stack>
                <TableContainer component={Paper} sx={{
                    borderRadius: 1,
                    background: tableBg,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 0px 18px 0 #0005'
                        : '0 0px 24px 0 rgba(33,147,176,0.05)',
                    transition: "background 0.4s, box-shadow 0.3s",
                }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16, color: theme.palette.text.primary }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16, color: theme.palette.text.primary }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16, color: theme.palette.text.primary }}>Priority</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16, color: theme.palette.text.primary }}>Due</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16, color: theme.palette.text.primary }}>Assignees</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 16, color: theme.palette.text.primary }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map(task => (
                                <TableRow
                                    key={task._id}
                                    hover
                                    sx={{
                                        transition: 'background 0.2s',
                                        cursor: 'pointer',
                                        '&:hover': { background: theme.palette.action.hover },
                                    }}
                                >
                                    <TableCell
                                        onClick={() => handleShowDetails(task)}
                                        sx={{ cursor: 'pointer', fontWeight: 600, fontSize: 15, maxWidth: 220 }}
                                    >
                                        <Tooltip title="View details" arrow>
                                            <Box
                                                sx={{
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: 200,
                                                }}
                                            >
                                                {task.title}
                                            </Box>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.status?.replace("-", " ")}
                                            color={statusColors[task.status] || 'default'}
                                            size="small"
                                            sx={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.priority}
                                            color={priorityColors[task.priority]}
                                            size="small"
                                            sx={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '--'}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={0.5}>
                                            {(task.assignedTo || []).length === 0 && (
                                                <Chip label="Unassigned" size="small" sx={{ bgcolor: assigneeBg, color: theme.palette.text.secondary }} />
                                            )}
                                            {(task.assignedTo || []).map(u => (
                                                <Chip
                                                    key={u._id}
                                                    avatar={
                                                        u.avatar
                                                            ? <Avatar src={u.avatar} alt={u.name || u.email} />
                                                            : <Avatar sx={{ width: 24, height: 24, fontSize: 13 }}>
                                                                {(u.name || u.email || 'U')[0]}
                                                            </Avatar>
                                                    }
                                                    label={u.name || u.email}
                                                    size="small"
                                                    sx={{
                                                        maxWidth: 110,
                                                        bgcolor: assigneeBg,
                                                        color: theme.palette.text.primary,
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="View details" arrow>
                                                <IconButton size="small" onClick={() => handleShowDetails(task)}>
                                                    <VisibilityIcon color="primary" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit" arrow>
                                                <IconButton size="small" onClick={() => handleEdit(task)}>
                                                    <EditNoteIcon sx={{ color: theme.palette.secondary.main }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete" arrow>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(task._id)}>
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TaskFormDialog open={openForm} onClose={handleFormClose} editTask={editTask} />
                <TaskDetailsDialog task={detailsTask} onClose={() => setDetailsTask(null)} />
            </CardContent>
        </Card>
    );
};

export default TaskTable;