import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button,
    Box, Avatar, Divider, useTheme, TextField, IconButton,
    LinearProgress, Checkbox, CircularProgress, Stack,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const STATUS_META = {
    pending:     { label: 'Pending',     color: '#f59e0b' },
    'in-progress': { label: 'In Progress', color: '#6366f1' },
    completed:   { label: 'Completed',   color: '#10b981' },
};
const PRIORITY_META = {
    low:    { label: 'Low',    color: '#10b981' },
    medium: { label: 'Medium', color: '#f59e0b' },
    high:   { label: 'High',   color: '#ef4444' },
};

const MetaBadge = ({ color, label }) => (
    <Box
        sx={{
            px: 0.875,
            py: 0.25,
            borderRadius: 0.75,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.03em',
            color,
            bgcolor: `${color}18`,
            textTransform: 'capitalize',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
        }}
    >
        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: color }} />
        {label}
    </Box>
);

const TaskDetailsDialog = ({ task, onClose, onRefresh }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    const [fullTask, setFullTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [newSubtask, setNewSubtask] = useState('');
    const [addingSubtask, setAddingSubtask] = useState(false);
    const { authHeader } = useAuth();

    useEffect(() => {
        if (!task) { setFullTask(null); return; }
        const load = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/tasks/${task._id}`, { headers: authHeader });
                setFullTask(data);
            } catch {
                setFullTask(task);
            } finally {
                setLoading(false);
            }
        };
        load();
        setComment('');
        setNewSubtask('');
    }, [task]);

    const refreshTask = async () => {
        const { data } = await axios.get(`/api/tasks/${task._id}`, { headers: authHeader });
        setFullTask(data);
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        setSubmittingComment(true);
        try {
            await axios.post(`/api/tasks/${task._id}/comments`, { comment }, { headers: authHeader });
            toast.success('Comment added');
            setComment('');
            await refreshTask();
        } catch {
            toast.error('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleAddSubtask = async () => {
        if (!newSubtask.trim()) return;
        setAddingSubtask(true);
        try {
            await axios.post(`/api/tasks/${task._id}/subtasks`, { title: newSubtask }, { headers: authHeader });
            toast.success('Subtask added');
            setNewSubtask('');
            await refreshTask();
        } catch {
            toast.error('Failed to add subtask');
        } finally {
            setAddingSubtask(false);
        }
    };

    const handleToggleSubtask = async (sid) => {
        try {
            await axios.patch(`/api/tasks/${task._id}/subtasks/${sid}`, {}, { headers: authHeader });
            await refreshTask();
        } catch {
            toast.error('Failed to update subtask');
        }
    };

    if (!task) return null;

    const t = fullTask || task;
    const completedSubs = (t.subtasks || []).filter(s => s.completed).length;
    const totalSubs = (t.subtasks || []).length;
    const subtaskPct = totalSubs > 0 ? (completedSubs / totalSubs) * 100 : 0;
    const statusMeta = STATUS_META[t.status] || { label: t.status, color: '#64748b' };
    const priorityMeta = PRIORITY_META[t.priority] || { label: t.priority, color: '#64748b' };

    return (
        <Dialog
            open={Boolean(task)}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 1.5,
                    bgcolor: dark ? '#0d1424' : '#fff',
                    backgroundImage: 'none',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.1)'}`,
                    maxHeight: '90vh',
                },
            }}
        >
            <DialogTitle sx={{ px: 3, pt: 3, pb: 0 }}>
                <Typography fontSize={14} fontWeight={700} letterSpacing="0.04em" color="text.secondary">
                    TASK DETAILS
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                {loading && (
                    <LinearProgress sx={{ mb: 2, borderRadius: 0.5, height: 2 }} />
                )}

                <Stack spacing={2.5}>
                    {/* Title + description */}
                    <Box>
                        <Typography fontSize={16} fontWeight={700} lineHeight={1.4} mb={1}>
                            {t.title}
                        </Typography>
                        {t.description && (
                            <Typography
                                fontSize={13}
                                color="text.secondary"
                                lineHeight={1.6}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'}`,
                                }}
                            >
                                {t.description}
                            </Typography>
                        )}
                    </Box>

                    {/* Meta badges */}
                    <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
                        <MetaBadge color={statusMeta.color} label={statusMeta.label} />
                        <MetaBadge color={priorityMeta.color} label={priorityMeta.label} />
                        {t.dueDate && (
                            <Box sx={{ fontSize: 11, fontWeight: 500, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                                Due {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Box>
                        )}
                    </Box>

                    {/* Assignees */}
                    {(t.assignedTo || []).length > 0 && (
                        <Box>
                            <Typography fontSize={11} fontWeight={700} letterSpacing="0.06em" color="text.disabled" mb={1}>
                                ASSIGNEES
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                {t.assignedTo.map(u => (
                                    <Box
                                        key={u._id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.75,
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
                                        }}
                                    >
                                        <Avatar sx={{ width: 18, height: 18, fontSize: 9, bgcolor: '#6366f1' }}>
                                            {(u.name || u.email || 'U')[0]}
                                        </Avatar>
                                        <Typography fontSize={12}>{u.name || u.email}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Divider />

                    {/* Subtasks */}
                    <Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                            <Typography fontSize={11} fontWeight={700} letterSpacing="0.06em" color="text.disabled">
                                SUBTASKS
                            </Typography>
                            {totalSubs > 0 && (
                                <Typography fontSize={11} color="text.disabled" fontVariantNumeric="tabular-nums">
                                    {completedSubs}/{totalSubs}
                                </Typography>
                            )}
                        </Box>

                        {totalSubs > 0 && (
                            <Box sx={{ mb: 1.5, height: 3, borderRadius: 1, bgcolor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)', overflow: 'hidden' }}>
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: `${subtaskPct}%`,
                                        bgcolor: subtaskPct === 100 ? '#10b981' : '#6366f1',
                                        borderRadius: 1,
                                        transition: 'width 0.3s ease',
                                    }}
                                />
                            </Box>
                        )}

                        <Stack spacing={0.25} mb={1.5}>
                            {(t.subtasks || []).map(s => (
                                <Box
                                    key={s._id}
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    sx={{
                                        px: 0.5,
                                        py: 0.25,
                                        borderRadius: 0.75,
                                        '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.02)' },
                                    }}
                                >
                                    <Checkbox
                                        checked={s.completed}
                                        onChange={() => handleToggleSubtask(s._id)}
                                        size="small"
                                        sx={{ p: 0.25, color: 'text.disabled', '&.Mui-checked': { color: '#6366f1' } }}
                                    />
                                    <Typography
                                        fontSize={13}
                                        sx={{
                                            textDecoration: s.completed ? 'line-through' : 'none',
                                            color: s.completed ? 'text.disabled' : 'text.primary',
                                        }}
                                    >
                                        {s.title}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>

                        <Box display="flex" gap={1}>
                            <TextField
                                size="small"
                                placeholder="Add subtask..."
                                value={newSubtask}
                                onChange={e => setNewSubtask(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                                sx={{ flex: 1, '& .MuiInputBase-input': { fontSize: 13 } }}
                            />
                            <IconButton
                                onClick={handleAddSubtask}
                                disabled={!newSubtask.trim() || addingSubtask}
                                size="small"
                                sx={{ borderRadius: 1, border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.1)'}` }}
                            >
                                {addingSubtask ? <CircularProgress size={16} /> : <AddRoundedIcon sx={{ fontSize: 18 }} />}
                            </IconButton>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Comments */}
                    <Box>
                        <Typography fontSize={11} fontWeight={700} letterSpacing="0.06em" color="text.disabled" mb={1.5}>
                            COMMENTS ({(t.comments || []).length})
                        </Typography>

                        <Stack spacing={1.5} mb={2} sx={{ maxHeight: 200, overflowY: 'auto' }}>
                            {(t.comments || []).length === 0 && (
                                <Typography fontSize={12} color="text.disabled">No comments yet.</Typography>
                            )}
                            {(t.comments || []).map((c, i) => (
                                <Box key={i} display="flex" gap={1.25} alignItems="flex-start">
                                    <Avatar sx={{ width: 24, height: 24, fontSize: 10, bgcolor: '#6366f1', flexShrink: 0 }}>
                                        {(c.user?.name || c.user?.email || 'U')[0]}
                                    </Avatar>
                                    <Box flex={1}>
                                        <Box display="flex" alignItems="center" gap={1} mb={0.25}>
                                            <Typography fontSize={12} fontWeight={600}>
                                                {c.user?.name || c.user?.email || 'User'}
                                            </Typography>
                                            <Typography fontSize={11} color="text.disabled" fontVariantNumeric="tabular-nums">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                p: 1,
                                                borderRadius: 1,
                                                border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'}`,
                                            }}
                                        >
                                            <Typography fontSize={13} lineHeight={1.5}>{c.comment}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>

                        <Box display="flex" gap={1}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                                multiline
                                maxRows={3}
                                sx={{ '& .MuiInputBase-input': { fontSize: 13 } }}
                            />
                            <IconButton
                                onClick={handleAddComment}
                                disabled={!comment.trim() || submittingComment}
                                size="small"
                                sx={{
                                    borderRadius: 1,
                                    alignSelf: 'flex-end',
                                    bgcolor: '#6366f1',
                                    color: '#fff',
                                    '&:hover': { bgcolor: '#4f46e5' },
                                    '&.Mui-disabled': { bgcolor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)', color: 'text.disabled' },
                                }}
                            >
                                {submittingComment ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : <SendRoundedIcon sx={{ fontSize: 16 }} />}
                            </IconButton>
                        </Box>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    size="small"
                    sx={{ fontSize: 13, fontWeight: 600 }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskDetailsDialog;
