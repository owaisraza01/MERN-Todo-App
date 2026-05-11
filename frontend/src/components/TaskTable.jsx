import React, { useEffect, useState } from 'react';
import {
    Typography, Button, Table, TableHead, TableRow, TableCell, TableBody,
    Chip, Stack, Box, Avatar, Tooltip, IconButton, useTheme, TableContainer, Paper, Card, CardContent,
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TaskFormDialog from './TaskFormDialog';
import TaskDetailsDialog from './TaskDetailsDialog';
import EmptyState from './ui/EmptyState';
import { TaskTableSkeleton } from './ui/SkeletonLoader';
import axios from 'axios';
import toast from 'react-hot-toast';

const statusColors = {
    pending: 'warning',
    'in-progress': 'info',
    completed: 'success',
};

const priorityColors = {
    low: 'default',
    medium: 'warning',
    high: 'error',
};

const TaskTable = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [detailsTask, setDetailsTask] = useState(null);
    const theme = useTheme();

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(data);
        } catch {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const handleEdit = (task) => { setEditTask(task); setOpenForm(true); };

    const handleFormClose = (refresh = false) => {
        setOpenForm(false);
        setEditTask(null);
        if (refresh) fetchTasks();
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm('Delete this task?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Task deleted');
            fetchTasks();
        } catch {
            toast.error('Failed to delete task');
        }
    };

    const tableBg = theme.palette.mode === 'dark' ? '#1a2030' : '#ffffff';

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: theme.palette.mode === 'dark' ? '#1e2533' : '#ffffff',
            }}
        >
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight={800} color="primary">
                        Tasks
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddTaskIcon />}
                        onClick={() => setOpenForm(true)}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                            textTransform: 'none',
                            '&:hover': { background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' },
                        }}
                    >
                        Add Task
                    </Button>
                </Stack>

                {loading ? (
                    <TaskTableSkeleton />
                ) : tasks.length === 0 ? (
                    <EmptyState
                        title="No tasks yet"
                        subtitle="Create your first task and start tracking your work"
                        actionLabel="Add Task"
                        onAction={() => setOpenForm(true)}
                    />
                ) : (
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{ borderRadius: 2, background: tableBg, border: '1px solid', borderColor: 'divider' }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {['Title', 'Status', 'Priority', 'Due', 'Assignees', 'Actions'].map(col => (
                                        <TableCell
                                            key={col}
                                            align={col === 'Actions' ? 'right' : 'left'}
                                            sx={{ fontWeight: 700, fontSize: 14 }}
                                        >
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.map(task => (
                                    <TableRow
                                        key={task._id}
                                        hover
                                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                    >
                                        <TableCell
                                            onClick={() => setDetailsTask(task)}
                                            sx={{ fontWeight: 600, fontSize: 14, maxWidth: 220 }}
                                        >
                                            <Tooltip title="View details" arrow>
                                                <Box sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 200 }}>
                                                    {task.title}
                                                </Box>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={task.status?.replace('-', ' ')}
                                                color={statusColors[task.status] || 'default'}
                                                size="small"
                                                sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={task.priority}
                                                color={priorityColors[task.priority]}
                                                size="small"
                                                sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 13, color: 'text.secondary' }}>
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={0.5}>
                                                {(task.assignedTo || []).length === 0 ? (
                                                    <Chip label="Unassigned" size="small" sx={{ color: 'text.disabled' }} />
                                                ) : (
                                                    (task.assignedTo || []).map(u => (
                                                        <Chip
                                                            key={u._id}
                                                            avatar={
                                                                u.avatar
                                                                    ? <Avatar src={u.avatar} />
                                                                    : <Avatar sx={{ width: 22, height: 22, fontSize: 11 }}>
                                                                        {(u.name || u.email || 'U')[0]}
                                                                    </Avatar>
                                                            }
                                                            label={u.name || u.email}
                                                            size="small"
                                                            sx={{ fontWeight: 500, maxWidth: 110 }}
                                                        />
                                                    ))
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                <Tooltip title="View details" arrow>
                                                    <IconButton size="small" onClick={() => setDetailsTask(task)}>
                                                        <VisibilityIcon fontSize="small" color="primary" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit" arrow>
                                                    <IconButton size="small" onClick={() => handleEdit(task)}>
                                                        <EditNoteIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete" arrow>
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(task._id)}>
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <TaskFormDialog open={openForm} onClose={handleFormClose} editTask={editTask} />
                <TaskDetailsDialog task={detailsTask} onClose={() => setDetailsTask(null)} />
            </CardContent>
        </Card>
    );
};

export default TaskTable;
