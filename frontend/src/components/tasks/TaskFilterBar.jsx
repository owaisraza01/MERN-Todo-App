import React from 'react';
import { Box, TextField, MenuItem, Button, Typography } from '@mui/material';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

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

const selectSx = { minWidth: 130 };

const TaskFilterBar = ({ filters, onChange, users = [] }) => {
    const hasFilters = filters.status || filters.priority || filters.assignedTo;
    const set = key => e => onChange({ ...filters, [key]: e.target.value });
    const clear = () => onChange({ status: '', priority: '', assignedTo: '' });

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
                mb: 2,
            }}
        >
            <TuneRoundedIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />

            <TextField select size="small" label="Status" value={filters.status} onChange={set('status')} sx={selectSx}>
                <MenuItem value=""><Typography fontSize={13} color="text.secondary">All statuses</Typography></MenuItem>
                {STATUSES.map(s => <MenuItem key={s.value} value={s.value}><Typography fontSize={13}>{s.label}</Typography></MenuItem>)}
            </TextField>

            <TextField select size="small" label="Priority" value={filters.priority} onChange={set('priority')} sx={selectSx}>
                <MenuItem value=""><Typography fontSize={13} color="text.secondary">All priorities</Typography></MenuItem>
                {PRIORITIES.map(p => <MenuItem key={p.value} value={p.value}><Typography fontSize={13}>{p.label}</Typography></MenuItem>)}
            </TextField>

            <TextField select size="small" label="Assignee" value={filters.assignedTo} onChange={set('assignedTo')} sx={{ minWidth: 150 }}>
                <MenuItem value=""><Typography fontSize={13} color="text.secondary">All members</Typography></MenuItem>
                {users.map(u => (
                    <MenuItem key={u._id} value={u._id}>
                        <Typography fontSize={13}>{u.name || u.email}</Typography>
                    </MenuItem>
                ))}
            </TextField>

            {hasFilters && (
                <Button
                    size="small"
                    startIcon={<CloseRoundedIcon sx={{ fontSize: 14 }} />}
                    onClick={clear}
                    sx={{ color: 'text.secondary', fontSize: 12 }}
                >
                    Clear
                </Button>
            )}

            {hasFilters && (
                <Box
                    sx={{
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: '#6366f1',
                        bgcolor: 'rgba(99,102,241,0.1)',
                    }}
                >
                    FILTERED
                </Box>
            )}
        </Box>
    );
};

export default TaskFilterBar;
