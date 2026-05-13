import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Box, Typography, Avatar, Stack, useTheme } from '@mui/material';
import { tokens } from '../../theme/theme';

const COLUMNS = [
    { id: 'pending',     label: 'Pending',     color: '#f59e0b', key: '01' },
    { id: 'in-progress', label: 'Active',      color: tokens.accent, key: '02' },
    { id: 'completed',   label: 'Done',        color: '#22c55e', key: '03' },
];

const PRIORITY_COLORS = {
    low:    '#22c55e',
    medium: '#f59e0b',
    high:   '#f43f5e',
};

const TaskCard = ({ task, index, onClick }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
    const pColor = PRIORITY_COLORS[task.priority] || '#71717a';

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
                        border: `1px solid ${snapshot.isDragging
                            ? tokens.accent
                            : dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,10,13,0.08)'}`,
                        bgcolor: snapshot.isDragging
                            ? (dark ? '#18181d' : '#fafaf7')
                            : theme.palette.background.paper,
                        cursor: 'grab',
                        position: 'relative',
                        transition: 'border-color 0.12s, background 0.12s',
                        '&:hover': { borderColor: dark ? 'rgba(255,255,255,0.14)' : 'rgba(10,10,13,0.16)' },
                        '&:active': { cursor: 'grabbing' },
                    }}
                >
                    {/* Priority strip */}
                    <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, bgcolor: pColor }} />

                    <Typography fontSize={13} fontWeight={500} sx={{ mb: 1.25, lineHeight: 1.4, ml: 0.5 }}>
                        {task.title}
                    </Typography>

                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ ml: 0.5 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, fontWeight: 600, color: pColor, letterSpacing: '0.08em' }}>
                                {(task.priority || '').toUpperCase()}
                            </Typography>
                            {task.subtasks?.length > 0 && (
                                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: 'text.secondary', letterSpacing: '0.04em' }}>
                                    [{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}]
                                </Typography>
                            )}
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            {task.dueDate && (
                                <Typography sx={{
                                    fontFamily: tokens.fontMono,
                                    fontSize: 10,
                                    fontWeight: overdue ? 600 : 400,
                                    color: overdue ? '#f43f5e' : 'text.secondary',
                                    letterSpacing: '0.04em',
                                }}>
                                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
                                </Typography>
                            )}
                            <Stack direction="row" spacing={-0.75}>
                                {(task.assignedTo || []).slice(0, 2).map(u => (
                                    <Avatar
                                        key={u._id}
                                        sx={{
                                            width: 20, height: 20, fontSize: 9, fontWeight: 600,
                                            bgcolor: 'transparent', color: tokens.accent,
                                            border: `1px solid ${tokens.accent}80`,
                                            fontFamily: tokens.fontMono,
                                        }}
                                    >
                                        {(u.name || u.email || 'U')[0].toUpperCase()}
                                    </Avatar>
                                ))}
                            </Stack>
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
                        <Box key={col.id} sx={{ flex: 1, minWidth: 280 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5, pb: 1.25, borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,10,13,0.08)'}` }}>
                                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 10, color: col.color, letterSpacing: '0.1em', fontWeight: 600 }}>
                                    {col.key}
                                </Typography>
                                <Box sx={{ width: 6, height: 6, bgcolor: col.color }} />
                                <Typography sx={{ fontFamily: tokens.fontMono, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                                    {col.label}
                                </Typography>
                                <Typography sx={{ ml: 'auto', fontFamily: tokens.fontMono, fontSize: 11, fontWeight: 700, color: col.color, letterSpacing: '0.06em' }}>
                                    {String(colTasks.length).padStart(2, '0')}
                                </Typography>
                            </Box>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            minHeight: 200,
                                            p: 1,
                                            border: `1px dashed ${snapshot.isDraggingOver
                                                ? col.color
                                                : dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,13,0.08)'}`,
                                            bgcolor: snapshot.isDraggingOver ? `${col.color}10` : 'transparent',
                                            transition: 'all 0.12s',
                                        }}
                                    >
                                        {colTasks.map((task, index) => (
                                            <TaskCard key={task._id} task={task} index={index} onClick={onTaskClick} />
                                        ))}
                                        {provided.placeholder}
                                        {colTasks.length === 0 && !snapshot.isDraggingOver && (
                                            <Typography sx={{
                                                fontFamily: tokens.fontMono, fontSize: 10,
                                                color: 'text.disabled', textAlign: 'center', py: 5,
                                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                            }}>
                                                — Empty —
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
