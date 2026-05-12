import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Box, Avatar, Typography, useTheme,
} from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const PRIORITIES = [
    { label: 'Low', value: 'low', color: '#10b981' },
    { label: 'Medium', value: 'medium', color: '#f59e0b' },
    { label: 'High', value: 'high', color: '#ef4444' },
];

const STATUSES = [
    { label: 'Pending', value: 'pending', color: '#f59e0b' },
    { label: 'In Progress', value: 'in-progress', color: '#6366f1' },
    { label: 'Completed', value: 'completed', color: '#10b981' },
];

const EMPTY_FORM = { title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', assignedTo: [] };

const TaskFormDialog = ({ open, onClose, editTask }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [users, setUsers] = useState([]);
    const [saving, setSaving] = useState(false);
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const { authHeader } = useAuth();

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
        axios.get('/api/users', { headers: authHeader })
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
        try {
            if (editTask) {
                await axios.put(`/api/tasks/${editTask._id}`, form, { headers: authHeader });
                toast.success('Task updated');
            } else {
                await axios.post('/api/tasks', form, { headers: authHeader });
                toast.success('Task created');
            }
            onClose(true);
        } catch {
            toast.error(editTask ? 'Failed to update task' : 'Failed to create task');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 1.5,
                    bgcolor: dark ? '#0d1424' : '#fff',
                    backgroundImage: 'none',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.1)'}`,
                },
            }}
        >
            <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
                <Typography fontSize={14} fontWeight={700} letterSpacing="0.04em" color="text.primary">
                    {editTask ? 'EDIT TASK' : 'NEW TASK'}
                </Typography>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ px: 3, pt: 1, pb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        required
                        name="title"
                        label="Title"
                        placeholder="Task title"
                        value={form.title}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                    />

                    <TextField
                        multiline
                        rows={3}
                        name="description"
                        label="Description"
                        placeholder="Optional description"
                        value={form.description}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                    />

                    <Box display="flex" gap={2}>
                        <TextField
                            select
                            name="status"
                            label="Status"
                            value={form.status}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                        >
                            {STATUSES.map(s => (
                                <MenuItem key={s.value} value={s.value}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
                                        <Typography fontSize={13}>{s.label}</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            name="priority"
                            label="Priority"
                            value={form.priority}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                        >
                            {PRIORITIES.map(p => (
                                <MenuItem key={p.value} value={p.value}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: p.color, flexShrink: 0 }} />
                                        <Typography fontSize={13}>{p.label}</Typography>
                                    </Box>
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
                        size="small"
                        fullWidth
                    />

                    <TextField
                        select
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map(id => {
                                        const u = users.find(u => u._id === id);
                                        return (
                                            <Box
                                                key={id}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    px: 0.75,
                                                    py: 0.25,
                                                    borderRadius: 0.75,
                                                    border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.12)'}`,
                                                    fontSize: 12,
                                                }}
                                            >
                                                <Avatar sx={{ width: 16, height: 16, fontSize: 9, bgcolor: '#6366f1' }}>
                                                    {(u?.name || u?.email || 'U')[0]}
                                                </Avatar>
                                                {u?.name || u?.email}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            ),
                        }}
                        name="assignedTo"
                        label="Assign To"
                        value={form.assignedTo}
                        onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
                        size="small"
                        fullWidth
                    >
                        {users.map(u => (
                            <MenuItem key={u._id} value={u._id}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: '#6366f1' }}>
                                        {(u.name || u.email || 'U')[0]}
                                    </Avatar>
                                    <Typography fontSize={13}>{u.name || u.email}</Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => onClose(false)}
                        size="small"
                        sx={{ fontSize: 13, fontWeight: 600 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                        size="small"
                        sx={{ fontSize: 13, fontWeight: 600, minWidth: 80 }}
                    >
                        {saving ? 'Saving...' : editTask ? 'Save' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TaskFormDialog;
