import React from 'react';
import { Box, TextField, MenuItem, Button, Typography, useTheme } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { tokens } from '../../theme/theme';

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

const TaskFilterBar = ({ filters, onChange, users = [] }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const hasFilters = filters.status || filters.priority || filters.assignedTo;
    const set = key => e => onChange({ ...filters, [key]: e.target.value });
    const clear = () => onChange({ status: '', priority: '', assignedTo: '' });

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 2.5 }}>
            <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.secondary', letterSpacing: '0.14em', textTransform: 'uppercase', mr: 0.5 }}>
                ◇ FILTER
            </Typography>

            <TextField select size="small" label="Status" value={filters.status} onChange={set('status')} sx={{ minWidth: 130 }}>
                <MenuItem value=""><Typography fontSize={13} color="text.secondary">All</Typography></MenuItem>
                {STATUSES.map(s => <MenuItem key={s.value} value={s.value}><Typography fontSize={13}>{s.label}</Typography></MenuItem>)}
            </TextField>

            <TextField select size="small" label="Priority" value={filters.priority} onChange={set('priority')} sx={{ minWidth: 130 }}>
                <MenuItem value=""><Typography fontSize={13} color="text.secondary">All</Typography></MenuItem>
                {PRIORITIES.map(p => <MenuItem key={p.value} value={p.value}><Typography fontSize={13}>{p.label}</Typography></MenuItem>)}
            </TextField>

            <TextField select size="small" label="Assignee" value={filters.assignedTo} onChange={set('assignedTo')} sx={{ minWidth: 150 }}>
                <MenuItem value=""><Typography fontSize={13} color="text.secondary">All</Typography></MenuItem>
                {users.map(u => (
                    <MenuItem key={u._id} value={u._id}>
                        <Typography fontSize={13}>{u.name || u.email}</Typography>
                    </MenuItem>
                ))}
            </TextField>

            {hasFilters && (
                <>
                    <Button
                        size="small"
                        startIcon={<CloseRoundedIcon sx={{ fontSize: 13 }} />}
                        onClick={clear}
                        sx={{ fontFamily: tokens.fontMono, color: 'text.secondary', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                    >
                        Clear
                    </Button>
                    <Box sx={{
                        px: 0.875, py: 0.2,
                        fontFamily: tokens.fontMono, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                        color: tokens.accentInk, bgcolor: tokens.accent,
                    }}>
                        ACTIVE
                    </Box>
                </>
            )}
        </Box>
    );
};

export default TaskFilterBar;
