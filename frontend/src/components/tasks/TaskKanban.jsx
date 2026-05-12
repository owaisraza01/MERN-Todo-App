import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Box, Typography, Avatar, Stack, useTheme } from '@mui/material';

const COLUMNS = [
    { id: 'pending',     label: 'Pending',     color: '#f59e0b' },
    { id: 'in-progress', label: 'In Progress',  color: '#6366f1' },
    { id: 'completed',   label: 'Completed',    color: '#10b981' },
];

const PRIORITY_COLORS = {
    low:    { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    high:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const TaskCard = ({ task, index, onClick }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
    const pStyle = PRIORITY_COLORS[task.priority] || { color: '#64748b', bg: 'transparent' };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(task)}
                    sx={{
                        mb: 1.5,
                        p: 1.75,
                        borderRadius: 1.5,
                        border: `1px solid ${snapshot.isDragging
                            ? 'rgba(99,102,241,0.4)'
                            : dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}`,
                        bgcolor: snapshot.isDragging
                            ? (dark ? '#151d2f' : '#f8faff')
                            : theme.palette.background.paper,
                        cursor: 'grab',
                        boxShadow: snapshot.isDragging
                            ? (dark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(15,23,42,0.12)')
                            : 'none',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                        '&:hover': {
                            borderColor: 'rgba(99,102,241,0.3)',
                        },
                        '&:active': { cursor: 'grabbing' },
                    }}
                >
                    <Typography fontSize={13} fontWeight={500} sx={{ mb: 1.5, lineHeight: 1.45 }}>
                        {task.title}
                    </Typography>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={0.75} alignItems="center">
                            <Box
                                sx={{
                                    px: 0.875,
                                    py: 0.25,
                                    borderRadius: 0.75,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    letterSpacing: '0.03em',
                                    color: pStyle.color,
                                    bgcolor: pStyle.bg,
                                    textTransform: 'capitalize',
                                }}
                            >
                                {task.priority}
                            </Box>
                            {task.subtasks?.length > 0 && (
                                <Typography fontSize={11} color="text.secondary">
                                    {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                </Typography>
                            )}
                        </Stack>

                        <Stack direction="row" spacing={-0.5} alignItems="center">
                            {task.dueDate && (
                                <Typography
                                    fontSize={11}
                                    fontWeight={overdue ? 600 : 400}
                                    color={overdue ? 'error.main' : 'text.secondary'}
                                    mr={0.75}
                                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                                >
                                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Typography>
                            )}
                            {(task.assignedTo || []).slice(0, 2).map(u => (
                                <Avatar
                                    key={u._id}
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        fontSize: 9,
                                        fontWeight: 700,
                                        bgcolor: '#6366f1',
                                        border: `2px solid ${theme.palette.background.paper}`,
                                    }}
                                >
                                    {(u.name || u.email || 'U')[0]}
                                </Avatar>
                            ))}
                        </Stack>
                    </Box>
                </Box>
            )}
        </Draggable>
    );
};

const TaskKanban = ({ tasks, onStatusChange, onTaskClick }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';

    const handleDragEnd = ({ destination, source, draggableId }) => {
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        onStatusChange(draggableId, destination.droppableId);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: 400 }}>
                {COLUMNS.map(col => {
                    const colTasks = tasks.filter(t => t.status === col.id);
                    return (
                        <Box key={col.id} sx={{ flex: 1, minWidth: 260 }}>
                            {/* Column header */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    mb: 1.5,
                                    px: 0.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: col.color,
                                        flexShrink: 0,
                                    }}
                                />
                                <Typography fontSize={12} fontWeight={600} letterSpacing="0.05em" color="text.secondary">
                                    {col.label.toUpperCase()}
                                </Typography>
                                <Box
                                    sx={{
                                        ml: 'auto',
                                        px: 1,
                                        py: 0.1,
                                        borderRadius: 0.75,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: col.color,
                                        bgcolor: `${col.color}18`,
                                    }}
                                >
                                    {colTasks.length}
                                </Box>
                            </Box>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            minHeight: 200,
                                            p: 1,
                                            borderRadius: 1.5,
                                            border: `1px dashed ${snapshot.isDraggingOver
                                                ? col.color
                                                : dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}`,
                                            bgcolor: snapshot.isDraggingOver
                                                ? `${col.color}08`
                                                : 'transparent',
                                            transition: 'border-color 0.15s, background 0.15s',
                                        }}
                                    >
                                        {colTasks.map((task, index) => (
                                            <TaskCard
                                                key={task._id}
                                                task={task}
                                                index={index}
                                                onClick={onTaskClick}
                                            />
                                        ))}
                                        {provided.placeholder}
                                        {colTasks.length === 0 && !snapshot.isDraggingOver && (
                                            <Typography
                                                fontSize={12}
                                                color="text.disabled"
                                                textAlign="center"
                                                py={5}
                                            >
                                                No tasks
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Droppable>
                        </Box>
                    );
                })}
            </Box>
        </DragDropContext>
    );
};

export default TaskKanban;
