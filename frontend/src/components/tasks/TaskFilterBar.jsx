import React from 'react';
import { Box, TextField, MenuItem, Button, Chip, useTheme } from '@mui/material';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

const STATUSES = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
];

const PRIORITIES = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

const selectSx = {
    minWidth: 130,
    '& .MuiInputBase-root': { borderRadius: 2, fontSize: 14 },
};

const TaskFilterBar = ({ filters, onChange, users = [] }) => {
    const theme = useTheme();
    const hasFilters = filters.status || filters.priority || filters.assignedTo;

    const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
    const clear = () => onChange({ status: '', priority: '', assignedTo: '' });

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
                p: 1.5,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(33,147,176,0.04)',
                border: '1px solid',
                borderColor: 'divider',
                mb: 2,
            }}
        >
            <FilterListRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />

            <TextField
                select
                size="small"
                label="Status"
                value={filters.status}
                onChange={set('status')}
                sx={selectSx}
            >
                <MenuItem value="">All</MenuItem>
                {STATUSES.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
            </TextField>

            <TextField
                select
                size="small"
                label="Priority"
                value={filters.priority}
                onChange={set('priority')}
                sx={selectSx}
            >
                <MenuItem value="">All</MenuItem>
                {PRIORITIES.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
            </TextField>

            <TextField
                select
                size="small"
                label="Assignee"
                value={filters.assignedTo}
                onChange={set('assignedTo')}
                sx={{ minWidth: 150, '& .MuiInputBase-root': { borderRadius: 2, fontSize: 14 } }}
            >
                <MenuItem value="">All</MenuItem>
                {users.map(u => (
                    <MenuItem key={u._id} value={u._id}>{u.name || u.email}</MenuItem>
                ))}
            </TextField>

            {hasFilters && (
                <Button
                    size="small"
                    startIcon={<ClearRoundedIcon />}
                    onClick={clear}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, color: 'error.main' }}
                >
                    Clear
                </Button>
            )}

            {hasFilters && (
                <Chip
                    label="Filters active"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                />
            )}
        </Box>
    );
};

export default TaskFilterBar;
