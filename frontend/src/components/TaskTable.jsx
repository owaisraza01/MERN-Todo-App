import React from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody, Chip, Stack, Box,
    Avatar, Tooltip, IconButton, useTheme, TableContainer, Paper, Checkbox,
    Button, Typography, Collapse,
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import EmptyState from './ui/EmptyState';
import { TaskTableSkeleton } from './ui/SkeletonLoader';

const STATUS_COLORS = {
    pending: 'warning',
    'in-progress': 'info',
    completed: 'success',
};

const PRIORITY_COLORS = {
    low: 'default',
    medium: 'warning',
    high: 'error',
};

const TaskTable = ({
    tasks = [],
    loading = false,
    selected = [],
    onSelectChange,
    onEdit,
    onDelete,
    onArchive,
    onView,
    onBulkDelete,
}) => {
    const theme = useTheme();

    const allSelected = tasks.length > 0 && selected.length === tasks.length;
    const someSelected = selected.length > 0 && selected.length < tasks.length;

    const toggleAll = () => {
        onSelectChange(allSelected ? [] : tasks.map(t => t._id));
    };

    const toggleOne = (id) => {
        onSelectChange(
            selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]
        );
    };

    if (loading) return <TaskTableSkeleton />;

    if (!loading && tasks.length === 0) {
        return (
            <EmptyState
                title="No tasks found"
                subtitle="Try adjusting your filters or create a new task"
            />
        );
    }

    return (
        <Box>
            <Collapse in={selected.length > 0}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        px: 2,
                        py: 1,
                        mb: 1.5,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        color: '#fff',
                    }}
                >
                    <Typography fontWeight={700} fontSize={14}>
                        {selected.length} selected
                    </Typography>
                    <Button
                        size="small"
                        startIcon={<DeleteSweepRoundedIcon />}
                        onClick={onBulkDelete}
                        sx={{ color: '#fff', borderColor: '#fff', textTransform: 'none', fontWeight: 700 }}
                        variant="outlined"
                    >
                        Delete Selected
                    </Button>
                    <Button
                        size="small"
                        onClick={() => onSelectChange([])}
                        sx={{ color: '#fff', textTransform: 'none', ml: 'auto' }}
                    >
                        Clear
                    </Button>
                </Box>
            </Collapse>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: theme.palette.mode === 'dark' ? '#1a2030' : '#fff',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={someSelected}
                                    checked={allSelected}
                                    onChange={toggleAll}
                                    size="small"
                                />
                            </TableCell>
                            {['Title', 'Status', 'Priority', 'Due', 'Assignees', 'Actions'].map(col => (
                                <TableCell
                                    key={col}
                                    align={col === 'Actions' ? 'right' : 'left'}
                                    sx={{ fontWeight: 700, fontSize: 13 }}
                                >
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
                                sx={{ '&.Mui-selected': { bgcolor: 'action.selected' } }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selected.includes(task._id)}
                                        onChange={() => toggleOne(task._id)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell
                                    onClick={() => onView(task)}
                                    sx={{ fontWeight: 600, fontSize: 14, cursor: 'pointer', maxWidth: 200 }}
                                >
                                    <Tooltip title="View details">
                                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {task.title}
                                        </Box>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={task.status?.replace('-', ' ')}
                                        color={STATUS_COLORS[task.status] || 'default'}
                                        size="small"
                                        sx={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 12 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={task.priority}
                                        color={PRIORITY_COLORS[task.priority]}
                                        size="small"
                                        sx={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 12 }}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontSize: 13, color: 'text.secondary' }}>
                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={0.5}>
                                        {(task.assignedTo || []).length === 0 ? (
                                            <Typography fontSize={12} color="text.disabled">Unassigned</Typography>
                                        ) : (
                                            (task.assignedTo || []).slice(0, 3).map(u => (
                                                <Tooltip key={u._id} title={u.name || u.email}>
                                                    <Avatar sx={{ width: 24, height: 24, fontSize: 11, background: 'linear-gradient(135deg, #6dd5ed, #2193b0)' }}>
                                                        {(u.name || u.email || 'U')[0]}
                                                    </Avatar>
                                                </Tooltip>
                                            ))
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                        <Tooltip title="View">
                                            <IconButton size="small" onClick={() => onView(task)}>
                                                <VisibilityIcon fontSize="small" color="primary" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => onEdit(task)}>
                                                <EditNoteIcon fontSize="small" color="secondary" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Archive">
                                            <IconButton size="small" onClick={() => onArchive(task._id)}>
                                                <ArchiveRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => onDelete(task._id)}>
                                                <DeleteOutlineIcon fontSize="small" />
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
