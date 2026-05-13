import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Button, Pagination, ToggleButtonGroup, ToggleButton, Tooltip,
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import TaskTable from '../components/TaskTable';
import TaskKanban from '../components/tasks/TaskKanban';
import TaskFilterBar from '../components/tasks/TaskFilterBar';
import TaskFormDialog from '../components/TaskFormDialog';
import TaskDetailsDialog from '../components/TaskDetailsDialog';
import PageHeader from '../components/layout/PageHeader';

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

    const { authHeader } = useAuth();

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

            const { data } = await axios.get('/api/tasks', { headers: authHeader, params });

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

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    useEffect(() => {
        axios.get('/api/users', { headers: authHeader })
            .then(r => setUsers(Array.isArray(r.data) ? r.data : r.data.users || []))
            .catch(() => {});
    }, []);

    const handleFilterChange = (newFilters) => { setFilters(newFilters); setPage(1); setSelected([]); };
    const handleFormClose = (refresh = false) => { setOpenForm(false); setEditTask(null); if (refresh) fetchTasks(); };
    const handleEdit = (task) => { setEditTask(task); setOpenForm(true); };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await axios.delete(`/api/tasks/${id}`, { headers: authHeader });
            toast.success('Task deleted');
            setSelected(s => s.filter(sid => sid !== id));
            fetchTasks();
        } catch { toast.error('Failed to delete task'); }
    };

    const handleArchive = async (id) => {
        try {
            await axios.patch(`/api/tasks/${id}/archive`, {}, { headers: authHeader });
            toast.success('Task archived');
            fetchTasks();
        } catch { toast.error('Failed to archive task'); }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selected.length} tasks?`)) return;
        try {
            await axios.post('/api/tasks/bulk-delete', { ids: selected }, { headers: authHeader });
            toast.success(`${selected.length} tasks deleted`);
            setSelected([]);
            fetchTasks();
        } catch { toast.error('Bulk delete failed'); }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const task = tasks.find(t => t._id === taskId);
        if (!task || task.status === newStatus) return;
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        try {
            await axios.put(`/api/tasks/${taskId}`, { ...task, status: newStatus }, { headers: authHeader });
            toast.success('Task moved');
        } catch { toast.error('Failed to update task'); fetchTasks(); }
    };

    const handleViewChange = (_, val) => { if (val) { setViewMode(val); setSelected([]); } };

    const handleExportCSV = () => {
        const headers = ['Title', 'Status', 'Priority', 'Due Date', 'Assignees', 'Created'];
        const rows = tasks.map(t => [
            `"${t.title.replace(/"/g, '""')}"`,
            t.status, t.priority,
            t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '',
            `"${(t.assignedTo || []).map(u => u.name || u.email).join('; ')}"`,
            new Date(t.createdAt).toLocaleDateString(),
        ].join(','));
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'taskflow-tasks.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <PageHeader
                index="02"
                title="Tasks"
                subtitle="Plan, assign and ship — across table and Kanban views, with bulk operations and CSV export."
                actions={
                    <>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadRoundedIcon sx={{ fontSize: 14 }} />}
                            onClick={handleExportCSV}
                            disabled={tasks.length === 0}
                        >
                            Export
                        </Button>
                        <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange} size="small">
                            <Tooltip title="Table view"><ToggleButton value="table"><TableRowsRoundedIcon sx={{ fontSize: 16 }} /></ToggleButton></Tooltip>
                            <Tooltip title="Kanban view"><ToggleButton value="kanban"><ViewKanbanRoundedIcon sx={{ fontSize: 16 }} /></ToggleButton></Tooltip>
                        </ToggleButtonGroup>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddTaskIcon sx={{ fontSize: 14 }} />}
                            onClick={() => setOpenForm(true)}
                        >
                            New Task
                        </Button>
                    </>
                }
            />

            <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 } }}>
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
                                    shape="rounded"
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <TaskKanban tasks={tasks} onStatusChange={handleStatusChange} onTaskClick={setDetailsTask} />
                )}
            </Box>

            <TaskFormDialog open={openForm} onClose={handleFormClose} editTask={editTask} />
            <TaskDetailsDialog task={detailsTask} onClose={() => setDetailsTask(null)} onRefresh={fetchTasks} />
        </>
    );
};

export default Tasks;
