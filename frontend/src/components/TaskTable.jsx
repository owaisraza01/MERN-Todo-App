import React from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody, Stack,
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
import { tokens } from '../theme/theme';

const STATUS_STYLES = {
    pending:       { color: '#f59e0b', label: 'PEND' },
    'in-progress': { color: tokens.accent, label: 'ACTIVE' },
    completed:     { color: '#22c55e', label: 'DONE' },
};
const PRIORITY_STYLES = {
    low:    { color: '#22c55e', label: 'LOW' },
    medium: { color: '#f59e0b', label: 'MED' },
    high:   { color: '#f43f5e', label: 'HIGH' },
};

const StatusTag = ({ status }) => {
    const s = STATUS_STYLES[status] || { color: '#71717a', label: status?.toUpperCase() };
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.625,
                px: 0.75,
                py: 0.2,
                fontFamily: tokens.fontMono,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: s.color,
                border: `1px solid ${s.color}66`,
                bgcolor: `${s.color}10`,
            }}
        >
            <Box sx={{ width: 5, height: 5, bgcolor: s.color }} />
            {s.label}
        </Box>
    );
};

const PriorityTag = ({ priority }) => {
    const p = PRIORITY_STYLES[priority] || { color: '#71717a', label: priority?.toUpperCase() };
    return (
        <Typography
            sx={{
                fontFamily: tokens.fontMono,
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: p.color,
            }}
        >
            {p.label}
        </Typography>
    );
};

const COLS = ['Title', 'Status', 'Pri', 'Due', 'Owners', ''];

const TaskTable = ({ tasks = [], loading = false, selected = [], onSelectChange, onEdit, onDelete, onArchive, onView, onBulkDelete }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';

    const allSelected = tasks.length > 0 && selected.length === tasks.length;
    const someSelected = selected.length > 0 && selected.length < tasks.length;

    if (loading) return <TaskTableSkeleton />;
    if (!loading && tasks.length === 0) return <EmptyState title="No tasks found" subtitle="Adjust filters or create a new task" />;

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
                        border: `1px solid ${tokens.accent}`,
                        bgcolor: dark ? 'rgba(212,255,58,0.06)' : 'rgba(184,230,44,0.1)',
                    }}
                >
                    <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, fontWeight: 600, color: tokens.accent, letterSpacing: '0.1em' }}>
                        {String(selected.length).padStart(2, '0')} SELECTED
                    </Typography>
                    <Button
                        size="small"
                        startIcon={<DeleteSweepRoundedIcon sx={{ fontSize: 14 }} />}
                        onClick={onBulkDelete}
                        sx={{ fontSize: 11, fontFamily: tokens.fontMono, color: '#f43f5e', letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 0, ml: 'auto' }}
                    >
                        Delete
                    </Button>
                    <Button
                        size="small"
                        onClick={() => onSelectChange([])}
                        sx={{ fontSize: 11, fontFamily: tokens.fontMono, color: 'text.secondary', letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 0 }}
                    >
                        Clear
                    </Button>
                </Box>
            </Collapse>

            <TableContainer
                sx={{
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,10,13,0.08)'}`,
                    bgcolor: theme.palette.background.paper,
                    overflow: 'auto',
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
                            <TableCell sx={{ width: 32 }}>#</TableCell>
                            {COLS.map(col => (
                                <TableCell key={col} align={col === '' ? 'right' : 'left'}>
                                    {col}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task, idx) => {
                            const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
                            return (
                                <TableRow key={task._id} hover selected={selected.includes(task._id)}>
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
                                    <TableCell sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: 'text.disabled', letterSpacing: '0.05em' }}>
                                        {String(idx + 1).padStart(2, '0')}
                                    </TableCell>
                                    <TableCell onClick={() => onView(task)} sx={{ cursor: 'pointer', maxWidth: 280 }}>
                                        <Typography
                                            fontSize={13}
                                            fontWeight={500}
                                            noWrap
                                            sx={{ '&:hover': { color: tokens.accent }, transition: 'color 0.12s' }}
                                        >
                                            {task.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell><StatusTag status={task.status} /></TableCell>
                                    <TableCell><PriorityTag priority={task.priority} /></TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontFamily: tokens.fontMono,
                                                fontSize: 11.5,
                                                fontWeight: overdue ? 600 : 400,
                                                color: overdue ? '#f43f5e' : 'text.secondary',
                                                letterSpacing: '0.04em',
                                            }}
                                        >
                                            {task.dueDate
                                                ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()
                                                : '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {(task.assignedTo || []).length === 0 ? (
                                            <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, color: 'text.disabled' }}>—</Typography>
                                        ) : (
                                            <Stack direction="row" spacing={-0.5}>
                                                {(task.assignedTo || []).slice(0, 3).map(u => (
                                                    <Tooltip key={u._id} title={u.name || u.email}>
                                                        <Avatar sx={{
                                                            width: 22, height: 22, fontSize: 9, fontWeight: 600,
                                                            bgcolor: 'transparent', color: tokens.accent,
                                                            border: `1px solid ${tokens.accent}80`,
                                                            fontFamily: tokens.fontMono,
                                                        }}>
                                                            {(u.name || u.email || 'U')[0].toUpperCase()}
                                                        </Avatar>
                                                    </Tooltip>
                                                ))}
                                            </Stack>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                                            <Tooltip title="View"><IconButton size="small" onClick={() => onView(task)} sx={{ color: 'text.secondary' }}><VisibilityOutlinedIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                                            <Tooltip title="Edit"><IconButton size="small" onClick={() => onEdit(task)} sx={{ color: 'text.secondary' }}><EditRoundedIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                                            <Tooltip title="Archive"><IconButton size="small" onClick={() => onArchive(task._id)} sx={{ color: 'text.secondary' }}><ArchiveOutlinedIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                                            <Tooltip title="Delete"><IconButton size="small" onClick={() => onDelete(task._id)} sx={{ color: '#f43f5e' }}><DeleteOutlineRoundedIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TaskTable;
