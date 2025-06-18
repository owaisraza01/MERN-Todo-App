import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Stack, Chip, Box, Avatar, useTheme
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FlagIcon from '@mui/icons-material/Flag';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditNoteIcon from '@mui/icons-material/EditNote';

const priorities = [
    { label: 'Low', value: 'low', color: 'default', icon: <FlagIcon sx={{ color: '#a3aed6' }} /> },
    { label: 'Medium', value: 'medium', color: 'warning', icon: <FlagIcon sx={{ color: '#fdcb6e' }} /> },
    { label: 'High', value: 'high', color: 'error', icon: <FlagIcon sx={{ color: '#f5576c' }} /> },
];

const statuses = [
    { label: 'Pending', value: 'pending', color: 'warning' },
    { label: 'In Progress', value: 'in-progress', color: 'info' },
    { label: 'Completed', value: 'completed', color: 'success' },
];

const TaskFormDialog = ({ open, onClose, editTask }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        assignedTo: [],
    });
    const [users, setUsers] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        if (editTask)
            setForm({
                ...editTask,
                dueDate: editTask.dueDate ? editTask.dueDate.slice(0, 10) : '',
                assignedTo: (editTask.assignedTo || []).map(u => u._id || u),
            });
        else
            setForm({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', assignedTo: [] });

        // Fetch users for assignment
        const token = localStorage.getItem('token');
        fetchUsers(token);

        // eslint-disable-next-line
    }, [open, editTask]);

    const fetchUsers = async (token) => {
        try {
            const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : data.users || []);
        } catch (err) {
            setUsers([]);
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleAssignees = e => setForm(f => ({ ...f, assignedTo: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editTask) {
                await fetch(`/api/tasks/${editTask._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                });
            } else {
                await fetch('/api/tasks', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                });
            }
            onClose(true);
        } catch {
            onClose(false);
        }
    };

    // Theme-aware backgrounds
    const glassBg =
        theme.palette.mode === "dark"
            ? "rgba(34, 40, 49, 0.98)"
            : "rgba(255,255,255,0.98)";
    const inputBg =
        theme.palette.mode === "dark"
            ? "rgba(44,62,80,0.85)"
            : "#f8fbff";

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 1,
                    background: glassBg,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 10px 40px 0 #000b'
                        : '0 10px 40px 0 rgba(33,147,176,0.14)',
                    p: 1,
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 900,
                    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                    color: theme.palette.primary.main,
                    letterSpacing: '-1px',
                }}
            >
                <EditNoteIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                {editTask ? 'Edit Task' : 'Add Task'}
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
                                startAdornment: <AssignmentIcon sx={{ mr: 1, color: theme.palette.mode === "dark" ? "#a3aed6" : "#789" }} />,
                                sx: {
                                    bgcolor: inputBg,
                                    borderRadius: 1,
                                    fontWeight: 600,
                                    fontSize: 16,
                                }
                            }}
                        />
                        <TextField
                            multiline
                            rows={3}
                            name="description"
                            label="Description"
                            placeholder="Describe the task details"
                            value={form.description}
                            onChange={handleChange}
                            InputProps={{
                                sx: {
                                    bgcolor: inputBg,
                                    borderRadius: 1,
                                    fontWeight: 500,
                                }
                            }}
                        />
                        <Box display="flex" gap={2}>
                            <TextField
                                select
                                name="status"
                                label="Status"
                                value={form.status}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    sx: { bgcolor: inputBg, borderRadius: 1 },
                                }}
                            >
                                {statuses.map(s => (
                                    <MenuItem key={s.value} value={s.value}>
                                        <Chip
                                            label={s.label}
                                            color={s.color}
                                            size="small"
                                            sx={{ mr: 1, fontWeight: 700 }}
                                        />
                                        {s.label}
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
                                InputProps={{
                                    sx: { bgcolor: inputBg, borderRadius: 1 },
                                }}
                            >
                                {priorities.map(p => (
                                    <MenuItem key={p.value} value={p.value}>
                                        <Chip
                                            icon={p.icon}
                                            label={p.label}
                                            color={p.color}
                                            size="small"
                                            sx={{ mr: 1, fontWeight: 700 }}
                                        />
                                        {p.label}
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
                                startAdornment: <CalendarMonthIcon sx={{ mr: 1, color: theme.palette.mode === "dark" ? "#a3aed6" : "#789" }} />,
                                sx: { bgcolor: inputBg, borderRadius: 1 }
                            }}
                        />
                        <TextField
                            select
                            SelectProps={{
                                multiple: true, renderValue: (selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((id) => {
                                            const user = users.find(u => u._id === id);
                                            return (
                                                <Chip
                                                    key={id}
                                                    avatar={
                                                        user?.avatar
                                                            ? <Avatar src={user.avatar} alt={user.name || user.email} />
                                                            : <Avatar>{(user?.name || user?.email || 'U')[0]}</Avatar>
                                                    }
                                                    label={user?.name || user?.email}
                                                    sx={{
                                                        bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[900] : "#f8fbff",
                                                        color: theme.palette.text.primary,
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            );
                                        })}
                                    </Box>
                                )
                            }}
                            name="assignedTo"
                            label="Assign To"
                            value={form.assignedTo}
                            onChange={handleAssignees}
                            InputProps={{
                                startAdornment: <PersonAddIcon sx={{ mr: 1, color: theme.palette.mode === "dark" ? "#a3aed6" : "#789" }} />,
                                sx: { bgcolor: inputBg, borderRadius: 1 }
                            }}
                        >
                            {(users || []).map(user => (
                                <MenuItem key={user._id} value={user._id}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Avatar sx={{ width: 24, height: 24, fontSize: 16 }} src={user.avatar}>
                                            {(user.name || user.email || 'U')[0]}
                                        </Avatar>
                                        {user.name || user.email}
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => onClose(false)}
                        sx={{
                            borderRadius: 1,
                            px: 3,
                            fontWeight: 700,
                            textTransform: 'none',
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            borderRadius: 1,
                            px: 3,
                            fontWeight: 700,
                            background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                            textTransform: 'none',
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 2px 8px #0006'
                                : '0 2px 8px 0 #2193b022',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)',
                            },
                        }}
                    >
                        {editTask ? 'Save' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TaskFormDialog;