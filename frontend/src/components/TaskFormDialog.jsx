import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Stack, Chip, Box, Avatar, useTheme,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FlagIcon from '@mui/icons-material/Flag';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditNoteIcon from '@mui/icons-material/EditNote';
import axios from 'axios';
import toast from 'react-hot-toast';

const priorities = [
    { label: 'Low', value: 'low', color: 'default' },
    { label: 'Medium', value: 'medium', color: 'warning' },
    { label: 'High', value: 'high', color: 'error' },
];

const statuses = [
    { label: 'Pending', value: 'pending', color: 'warning' },
    { label: 'In Progress', value: 'in-progress', color: 'info' },
    { label: 'Completed', value: 'completed', color: 'success' },
];

const EMPTY_FORM = { title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', assignedTo: [] };

const TaskFormDialog = ({ open, onClose, editTask }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [users, setUsers] = useState([]);
    const [saving, setSaving] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (editTask) {
            setForm({
                ...editTask,
                dueDate: editTask.dueDate ? editTask.dueDate.slice(0, 10) : '',
                assignedTo: (editTask.assignedTo || []).map(u => u._id || u),
            });
        } else {
            setForm(EMPTY_FORM);
        }

        const token = localStorage.getItem('token');
        axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setUsers(Array.isArray(res.data) ? res.data : res.data.users || []))
            .catch(() => setUsers([]));
    }, [open, editTask]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.title.trim()) { toast.error('Title is required'); return; }
        setSaving(true);
        const token = localStorage.getItem('token');
        try {
            if (editTask) {
                await axios.put(`/api/tasks/${editTask._id}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Task updated');
            } else {
                await axios.post('/api/tasks', form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Task created');
            }
            onClose(true);
        } catch {
            toast.error(editTask ? 'Failed to update task' : 'Failed to create task');
        } finally {
            setSaving(false);
        }
    };

    const inputBg = theme.palette.mode === 'dark' ? 'rgba(44,62,80,0.85)' : '#f8fbff';

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark' ? '#1e2533' : '#ffffff',
                    p: 1,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 800,
                    color: 'primary.main',
                }}
            >
                <EditNoteIcon />
                {editTask ? 'Edit Task' : 'New Task'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={2}>
                        <TextField
                            required
                            name="title"
                            label="Title"
                            placeholder="Enter task title"
                            value={form.title}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <AssignmentIcon sx={{ mr: 1, color: 'text.disabled' }} />,
                                sx: { bgcolor: inputBg, borderRadius: 2, fontWeight: 600 },
                            }}
                        />
                        <TextField
                            multiline
                            rows={3}
                            name="description"
                            label="Description"
                            placeholder="Describe the task"
                            value={form.description}
                            onChange={handleChange}
                            InputProps={{ sx: { bgcolor: inputBg, borderRadius: 2 } }}
                        />
                        <Box display="flex" gap={2}>
                            <TextField
                                select
                                name="status"
                                label="Status"
                                value={form.status}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ sx: { bgcolor: inputBg, borderRadius: 2 } }}
                            >
                                {statuses.map(s => (
                                    <MenuItem key={s.value} value={s.value}>
                                        <Chip label={s.label} color={s.color} size="small" sx={{ fontWeight: 700 }} />
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                name="priority"
                                label="Priority"
                                value={form.priority}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{ sx: { bgcolor: inputBg, borderRadius: 2 } }}
                            >
                                {priorities.map(p => (
                                    <MenuItem key={p.value} value={p.value}>
                                        <Chip
                                            icon={<FlagIcon />}
                                            label={p.label}
                                            color={p.color}
                                            size="small"
                                            sx={{ fontWeight: 700 }}
                                        />
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <TextField
                            name="dueDate"
                            label="Due Date"
                            type="date"
                            value={form.dueDate}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <CalendarMonthIcon sx={{ mr: 1, color: 'text.disabled' }} />,
                                sx: { bgcolor: inputBg, borderRadius: 2 },
                            }}
                        />
                        <TextField
                            select
                            SelectProps={{
                                multiple: true,
                                renderValue: (selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map(id => {
                                            const user = users.find(u => u._id === id);
                                            return (
                                                <Chip
                                                    key={id}
                                                    avatar={<Avatar>{(user?.name || user?.email || 'U')[0]}</Avatar>}
                                                    label={user?.name || user?.email}
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            );
                                        })}
                                    </Box>
                                ),
                            }}
                            name="assignedTo"
                            label="Assign To"
                            value={form.assignedTo}
                            onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
                            InputProps={{
                                startAdornment: <PersonAddIcon sx={{ mr: 1, color: 'text.disabled' }} />,
                                sx: { bgcolor: inputBg, borderRadius: 2 },
                            }}
                        >
                            {users.map(user => (
                                <MenuItem key={user._id} value={user._id}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Avatar sx={{ width: 24, height: 24, fontSize: 13 }}>
                                            {(user.name || user.email || 'U')[0]}
                                        </Avatar>
                                        {user.name || user.email}
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => onClose(false)}
                        sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 3 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            textTransform: 'none',
                            px: 3,
                            background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                            '&:hover': { background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' },
                        }}
                    >
                        {saving ? 'Saving...' : editTask ? 'Save' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TaskFormDialog;
