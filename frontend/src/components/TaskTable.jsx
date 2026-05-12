import React from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody, Chip, Stack,
    Box, Avatar, Tooltip, IconButton, useTheme, TableContainer,
    Checkbox, Button, Typography, Collapse,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import EmptyState from './ui/EmptyState';
import { TaskTableSkeleton } from './ui/SkeletonLoader';

const STATUS_STYLES = {
    pending:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Pending' },
    'in-progress': { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', label: 'In Progress' },
    completed:   { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Completed' },
};
const PRIORITY_STYLES = {
    low:    { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    high:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const StatusChip = ({ status }) => {
    const s = STATUS_STYLES[status] || { color: '#64748b', bg: 'transparent', label: status };
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1,
                py: 0.25,
                borderRadius: 1,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: s.color,
                bgcolor: s.bg,
            }}
        >
            {s.label.toUpperCase()}
        </Box>
    );
};

const PriorityDot = ({ priority }) => {
    const p = PRIORITY_STYLES[priority] || { color: '#64748b' };
    return (
        <Box display="flex" alignItems="center" gap={0.75}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: p.color, flexShrink: 0 }} />
            <Typography fontSize={12} fontWeight={500} sx={{ textTransform: 'capitalize', color: p.color }}>
                {priority}
            </Typography>
        </Box>
    );
};

const COLS = ['Title', 'Status', 'Priority', 'Due', 'Assignees', 'Actions'];

const TaskTable = ({ tasks = [], loading = false, selected = [], onSelectChange, onEdit, onDelete, onArchive, onView, onBulkDelete }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';

    const allSelected = tasks.length > 0 && selected.length === tasks.length;
    const someSelected = selected.length > 0 && selected.length < tasks.length;

    if (loading) return <TaskTableSkeleton />;
    if (!loading && tasks.length === 0) return <EmptyState title="No tasks found" subtitle="Try adjusting your filters or create a new task" />;

    return (
        <Box>
            <Collapse in={selected.length > 0}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 2,
                        py: 1,
                        mb: 1.5,
                        borderRadius: 1.5,
                        border: '1px solid rgba(99,102,241,0.3)',
                        bgcolor: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)',
                    }}
                >
                    <Typography fontSize={13} fontWeight={600} color="primary.main">
                        {selected.length} selected
                    </Typography>
                    <Button
                        size="small"
                        startIcon={<DeleteSweepRoundedIcon fontSize="small" />}
                        onClick={onBulkDelete}
                        color="error"
                        variant="outlined"
                        sx={{ fontSize: 12, py: 0.4 }}
                    >
                        Delete
                    </Button>
                    <Button
                        size="small"
                        onClick={() => onSelectChange([])}
                        sx={{ fontSize: 12, py: 0.4, ml: 'auto', color: 'text.secondary' }}
                    >
                        Clear
                    </Button>
                </Box>
            </Collapse>

            <TableContainer
                sx={{
                    borderRadius: 1.5,
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}`,
                    bgcolor: theme.palette.background.paper,
                    overflow: 'hidden',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 2 }}>
                                <Checkbox
                                    indeterminate={someSelected}
                                    checked={allSelected}
                                    onChange={() => onSelectChange(allSelected ? [] : tasks.map(t => t._id))}
                                    size="small"
                                />
                            </TableCell>
                            {COLS.map(col => (
                                <TableCell key={col} align={col === 'Actions' ? 'right' : 'left'}>
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
                                selected={selected.includes(task._id)}
                            >
                                <TableCell padding="checkbox" sx={{ pl: 2 }}>
                                    <Checkbox
                                        checked={selected.includes(task._id)}
                                        onChange={() => onSelectChange(
                                            selected.includes(task._id)
                                                ? selected.filter(s => s !== task._id)
                                                : [...selected, task._id]
                                        )}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell
                                    onClick={() => onView(task)}
                                    sx={{ cursor: 'pointer', maxWidth: 220 }}
                                >
                                    <Typography
                                        fontSize={13}
                                        fontWeight={500}
                                        noWrap
                                        sx={{ '&:hover': { color: 'primary.main' }, transition: 'color 0.15s' }}
                                    >
                                        {task.title}
                                    </Typography>
                                </TableCell>
                                <TableCell><StatusChip status={task.status} /></TableCell>
                                <TableCell><PriorityDot priority={task.priority} /></TableCell>
                                <TableCell>
                                    <Typography
                                        fontSize={12}
                                        color={
                                            task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
                                                ? 'error.main'
                                                : 'text.secondary'
                                        }
                                        sx={{ fontVariantNumeric: 'tabular-nums' }}
                                    >
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {(task.assignedTo || []).length === 0 ? (
                                        <Typography fontSize={12} color="text.disabled">—</Typography>
                                    ) : (
                                        <Stack direction="row" spacing={0.5}>
                                            {(task.assignedTo || []).slice(0, 3).map(u => (
                                                <Tooltip key={u._id} title={u.name || u.email}>
                                                    <Avatar
                                                        sx={{
                                                            width: 22,
                                                            height: 22,
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                            bgcolor: '#6366f1',
                                                        }}
                                                    >
                                                        {(u.name || u.email || 'U')[0]}
                                                    </Avatar>
                                                </Tooltip>
                                            ))}
                                        </Stack>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                                        <Tooltip title="View">
                                            <IconButton size="small" onClick={() => onView(task)} sx={{ color: 'text.secondary' }}>
                                                <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => onEdit(task)} sx={{ color: 'text.secondary' }}>
                                                <EditRoundedIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Archive">
                                            <IconButton size="small" onClick={() => onArchive(task._id)} sx={{ color: 'text.secondary' }}>
                                                <ArchiveOutlinedIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" onClick={() => onDelete(task._id)} sx={{ color: 'error.main' }}>
                                                <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TaskTable;
