import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    Box, Card, CardContent, Typography, Chip, Stack, Avatar, useTheme,
} from '@mui/material';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';

const COLUMNS = [
    { id: 'pending', label: 'Pending', color: '#f5576c', bg: 'rgba(245,87,108,0.08)' },
    { id: 'in-progress', label: 'In Progress', color: '#4facfe', bg: 'rgba(79,172,254,0.08)' },
    { id: 'completed', label: 'Completed', color: '#43e97b', bg: 'rgba(67,233,123,0.08)' },
];

const PRIORITY_COLORS = { low: 'default', medium: 'warning', high: 'error' };

const TaskCard = ({ task, index, onClick }) => {
    const theme = useTheme();
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(task)}
                    elevation={snapshot.isDragging ? 8 : 0}
                    sx={{
                        mb: 1.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: snapshot.isDragging
                            ? 'primary.main'
                            : theme.palette.divider,
                        cursor: 'grab',
                        transition: 'box-shadow 0.2s, border-color 0.2s',
                        bgcolor: theme.palette.mode === 'dark' ? '#1e2533' : '#fff',
                        '&:hover': { borderColor: 'primary.light' },
                        '&:active': { cursor: 'grabbing' },
                    }}
                >
                    <CardContent sx={{ p: '12px !important' }}>
                        <Typography
                            fontSize={14}
                            fontWeight={600}
                            sx={{ mb: 1, lineHeight: 1.4 }}
                        >
                            {task.title}
                        </Typography>

                        <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mb: 1 }}>
                            <Chip
                                icon={<FlagRoundedIcon sx={{ fontSize: '12px !important' }} />}
                                label={task.priority}
                                color={PRIORITY_COLORS[task.priority]}
                                size="small"
                                sx={{ fontSize: 11, fontWeight: 700, textTransform: 'capitalize', height: 22 }}
                            />
                            {task.subtasks?.length > 0 && (
                                <Chip
                                    label={`${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length}`}
                                    size="small"
                                    sx={{ fontSize: 11, height: 22 }}
                                />
                            )}
                        </Stack>

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            {task.dueDate && (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <CalendarTodayRoundedIcon
                                        sx={{ fontSize: 12, color: isOverdue ? 'error.main' : 'text.disabled' }}
                                    />
                                    <Typography
                                        fontSize={11}
                                        color={isOverdue ? 'error.main' : 'text.secondary'}
                                        fontWeight={isOverdue ? 700 : 400}
                                    >
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            )}
                            <Stack direction="row" spacing={-0.5} sx={{ ml: 'auto' }}>
                                {(task.assignedTo || []).slice(0, 3).map(u => (
                                    <Avatar
                                        key={u._id}
                                        src={u.avatar}
                                        sx={{
                                            width: 22,
                                            height: 22,
                                            fontSize: 10,
                                            fontWeight: 700,
                                            border: '2px solid',
                                            borderColor: 'background.paper',
                                            background: 'linear-gradient(135deg, #6dd5ed, #2193b0)',
                                        }}
                                    >
                                        {(u.name || u.email || 'U')[0]}
                                    </Avatar>
                                ))}
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Draggable>
    );
};

const TaskKanban = ({ tasks, onStatusChange, onTaskClick }) => {
    const theme = useTheme();

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        onStatusChange(draggableId, destination.droppableId);
    };

    const tasksByStatus = (status) => tasks.filter(t => t.status === status);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: 400 }}>
                {COLUMNS.map(col => {
                    const colTasks = tasksByStatus(col.id);
                    return (
                        <Box key={col.id} sx={{ flex: 1, minWidth: 280 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 1.5,
                                    px: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        bgcolor: col.color,
                                        flexShrink: 0,
                                    }}
                                />
                                <Typography fontWeight={700} fontSize={14}>
                                    {col.label}
                                </Typography>
                                <Chip
                                    label={colTasks.length}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: 12,
                                        fontWeight: 700,
                                        bgcolor: col.bg,
                                        color: col.color,
                                    }}
                                />
                            </Box>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            minHeight: 200,
                                            borderRadius: 3,
                                            p: 1,
                                            bgcolor: snapshot.isDraggingOver
                                                ? col.bg
                                                : theme.palette.mode === 'dark'
                                                    ? 'rgba(255,255,255,0.02)'
                                                    : 'rgba(0,0,0,0.02)',
                                            border: '2px dashed',
                                            borderColor: snapshot.isDraggingOver
                                                ? col.color
                                                : 'transparent',
                                            transition: 'all 0.2s',
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
                                                variant="caption"
                                                color="text.disabled"
                                                sx={{ display: 'block', textAlign: 'center', py: 4 }}
                                            >
                                                Drop tasks here
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
