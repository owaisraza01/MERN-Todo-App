import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography, Button, Stack, Pagination,
    ToggleButtonGroup, ToggleButton, Tooltip,
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import axios from 'axios';
import toast from 'react-hot-toast';
import TaskTable from '../components/TaskTable';
import TaskKanban from '../components/tasks/TaskKanban';
import TaskFilterBar from '../components/tasks/TaskFilterBar';
import TaskFormDialog from '../components/TaskFormDialog';
import TaskDetailsDialog from '../components/TaskDetailsDialog';

const LIMIT = 10;

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    const [filters, setFilters] = useState({ status: '', priority: '', assignedTo: '' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selected, setSelected] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [detailsTask, setDetailsTask] = useState(null);

    const token = () => localStorage.getItem('token');
    const headers = () => ({ Authorization: `Bearer ${token()}` });

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;
            if (filters.assignedTo) params.assignedTo = filters.assignedTo;

            if (viewMode === 'table') {
                params.page = page;
                params.limit = LIMIT;
            }

            const { data } = await axios.get('/api/tasks', { headers: headers(), params });

            if (data.tasks) {
                setTasks(data.tasks);
                setTotalPages(data.pages || 1);
            } else {
                setTasks(data);
            }
        } catch {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, [filters, page, viewMode]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        axios.get('/api/users', { headers: headers() })
            .then(r => setUsers(Array.isArray(r.data) ? r.data : r.data.users || []))
            .catch(() => {});
    }, []);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
        setSelected([]);
    };

    const handleFormClose = (refresh = false) => {
        setOpenForm(false);
        setEditTask(null);
        if (refresh) fetchTasks();
    };

    const handleEdit = (task) => { setEditTask(task); setOpenForm(true); };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await axios.delete(`/api/tasks/${id}`, { headers: headers() });
            toast.success('Task deleted');
            setSelected(s => s.filter(sid => sid !== id));
            fetchTasks();
        } catch {
            toast.error('Failed to delete task');
        }
    };

    const handleArchive = async (id) => {
        try {
            await axios.patch(`/api/tasks/${id}/archive`, {}, { headers: headers() });
            toast.success('Task archived');
            fetchTasks();
        } catch {
            toast.error('Failed to archive task');
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selected.length} tasks?`)) return;
        try {
            await axios.post('/api/tasks/bulk-delete', { ids: selected }, { headers: headers() });
            toast.success(`${selected.length} tasks deleted`);
            setSelected([]);
            fetchTasks();
        } catch {
            toast.error('Bulk delete failed');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const task = tasks.find(t => t._id === taskId);
        if (!task || task.status === newStatus) return;
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        try {
            await axios.put(`/api/tasks/${taskId}`, { ...task, status: newStatus }, { headers: headers() });
            toast.success('Task moved');
        } catch {
            toast.error('Failed to update task');
            fetchTasks();
        }
    };

    const handleViewChange = (_, val) => {
        if (val) { setViewMode(val); setSelected([]); }
    };

    return (
        <Box>
            <Card
                elevation={0}
                sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
            >
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                        <Typography variant="h6" fontWeight={800} color="primary">
                            Tasks
                        </Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={handleViewChange}
                                size="small"
                                sx={{ '& .MuiToggleButton-root': { borderRadius: 2, px: 1.5 } }}
                            >
                                <Tooltip title="Table view">
                                    <ToggleButton value="table">
                                        <TableRowsRoundedIcon fontSize="small" />
                                    </ToggleButton>
                                </Tooltip>
                                <Tooltip title="Kanban view">
                                    <ToggleButton value="kanban">
                                        <ViewKanbanRoundedIcon fontSize="small" />
                                    </ToggleButton>
                                </Tooltip>
                            </ToggleButtonGroup>
                            <Button
                                variant="contained"
                                startIcon={<AddTaskIcon />}
                                onClick={() => setOpenForm(true)}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                                    '&:hover': { background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' },
                                }}
                            >
                                Add Task
                            </Button>
                        </Stack>
                    </Stack>

                    <TaskFilterBar filters={filters} onChange={handleFilterChange} users={users} />

                    {viewMode === 'table' ? (
                        <>
                            <TaskTable
                                tasks={tasks}
                                loading={loading}
                                selected={selected}
                                onSelectChange={setSelected}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onArchive={handleArchive}
                                onView={setDetailsTask}
                                onBulkDelete={handleBulkDelete}
                            />
                            {totalPages > 1 && (
                                <Box display="flex" justifyContent="center" pt={3}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={(_, p) => setPage(p)}
                                        color="primary"
                                        shape="rounded"
                                    />
                                </Box>
                            )}
                        </>
                    ) : (
                        <TaskKanban
                            tasks={tasks}
                            onStatusChange={handleStatusChange}
                            onTaskClick={setDetailsTask}
                        />
                    )}
                </CardContent>
            </Card>

            <TaskFormDialog open={openForm} onClose={handleFormClose} editTask={editTask} />
            <TaskDetailsDialog
                task={detailsTask}
                onClose={() => setDetailsTask(null)}
                onRefresh={fetchTasks}
            />
        </Box>
    );
};

export default Tasks;
