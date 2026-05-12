import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button,
    Stack, Chip, Box, Avatar, Divider, useTheme, TextField, IconButton,
    LinearProgress, Checkbox, FormControlLabel, CircularProgress,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import axios from 'axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = { pending: 'warning', 'in-progress': 'info', completed: 'success' };
const PRIORITY_COLORS = { low: 'default', medium: 'warning', high: 'error' };

const TaskDetailsDialog = ({ task, onClose, onRefresh }) => {
    const theme = useTheme();
    const [fullTask, setFullTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [newSubtask, setNewSubtask] = useState('');
    const [addingSubtask, setAddingSubtask] = useState(false);

    const token = () => localStorage.getItem('token');
    const headers = () => ({ Authorization: `Bearer ${token()}` });

    useEffect(() => {
        if (!task) { setFullTask(null); return; }
        const fetch = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/tasks/${task._id}`, { headers: headers() });
                setFullTask(data);
            } catch {
                setFullTask(task);
            } finally {
                setLoading(false);
            }
        };
        fetch();
        setComment('');
        setNewSubtask('');
    }, [task]);

    const refreshTask = async () => {
        const { data } = await axios.get(`/api/tasks/${task._id}`, { headers: headers() });
        setFullTask(data);
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        setSubmittingComment(true);
        try {
            await axios.post(`/api/tasks/${task._id}/comments`, { comment }, { headers: headers() });
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
            await axios.post(`/api/tasks/${task._id}/subtasks`, { title: newSubtask }, { headers: headers() });
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
            await axios.patch(`/api/tasks/${task._id}/subtasks/${sid}`, {}, { headers: headers() });
            await refreshTask();
        } catch {
            toast.error('Failed to update subtask');
        }
    };

    if (!task) return null;

    const t = fullTask || task;
    const completedSubtasks = (t.subtasks || []).filter(s => s.completed).length;
    const totalSubtasks = (t.subtasks || []).length;
    const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const inputBg = theme.palette.mode === 'dark' ? 'rgba(44,62,80,0.5)' : '#f8fbff';

    return (
        <Dialog
            open={Boolean(task)}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark' ? '#1e2533' : '#ffffff',
                    maxHeight: '90vh',
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 800, color: 'primary.main' }}>
                <InfoOutlinedIcon />
                Task Details
            </DialogTitle>

            <DialogContent dividers sx={{ px: 3, py: 2 }}>
                {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

                <Stack spacing={2.5}>
                    <Box>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>{t.title}</Typography>
                        {t.description && (
                            <Typography
                                fontSize={14}
                                color="text.secondary"
                                sx={{ p: 1.5, borderRadius: 2, bgcolor: inputBg }}
                            >
                                {t.description}
                            </Typography>
                        )}
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip icon={<FlagIcon />} label={t.priority} color={PRIORITY_COLORS[t.priority] || 'default'} size="small" sx={{ fontWeight: 600, textTransform: 'capitalize' }} />
                        <Chip icon={<AssignmentIndIcon />} label={t.status?.replace('-', ' ')} color={STATUS_COLORS[t.status] || 'default'} size="small" sx={{ fontWeight: 600, textTransform: 'capitalize' }} />
                        {t.dueDate && <Chip icon={<AccessTimeIcon />} label={new Date(t.dueDate).toLocaleDateString()} color="info" size="small" sx={{ fontWeight: 600 }} />}
                    </Stack>

                    {(t.assignedTo || []).length > 0 && (
                        <Box>
                            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                ASSIGNEES
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {t.assignedTo.map(u => (
                                    <Chip
                                        key={u._id}
                                        avatar={<Avatar>{(u.name || u.email || 'U')[0]}</Avatar>}
                                        label={u.name || u.email}
                                        size="small"
                                        sx={{ fontWeight: 500 }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )}

                    <Divider />

                    {/* Subtasks */}
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                            <ChecklistRoundedIcon fontSize="small" color="primary" />
                            <Typography variant="subtitle2" fontWeight={700}>
                                Subtasks
                            </Typography>
                            {totalSubtasks > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                    {completedSubtasks}/{totalSubtasks}
                                </Typography>
                            )}
                        </Box>

                        {totalSubtasks > 0 && (
                            <LinearProgress
                                variant="determinate"
                                value={subtaskProgress}
                                sx={{ mb: 1.5, borderRadius: 1, height: 6 }}
                                color={subtaskProgress === 100 ? 'success' : 'primary'}
                            />
                        )}

                        <Stack spacing={0.5} mb={1.5}>
                            {(t.subtasks || []).map(s => (
                                <FormControlLabel
                                    key={s._id}
                                    control={
                                        <Checkbox
                                            checked={s.completed}
                                            onChange={() => handleToggleSubtask(s._id)}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography
                                            fontSize={14}
                                            sx={{ textDecoration: s.completed ? 'line-through' : 'none', color: s.completed ? 'text.disabled' : 'text.primary' }}
                                        >
                                            {s.title}
                                        </Typography>
                                    }
                                />
                            ))}
                        </Stack>

                        <Box display="flex" gap={1}>
                            <TextField
                                size="small"
                                placeholder="Add subtask..."
                                value={newSubtask}
                                onChange={e => setNewSubtask(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                                InputProps={{ sx: { borderRadius: 2, bgcolor: inputBg, fontSize: 13 } }}
                                sx={{ flex: 1 }}
                            />
                            <IconButton
                                onClick={handleAddSubtask}
                                disabled={!newSubtask.trim() || addingSubtask}
                                color="primary"
                                sx={{ borderRadius: 2 }}
                            >
                                {addingSubtask ? <CircularProgress size={18} /> : <AddRoundedIcon />}
                            </IconButton>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Comments */}
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
                            Comments ({(t.comments || []).length})
                        </Typography>

                        <Stack spacing={1.5} mb={2} sx={{ maxHeight: 200, overflowY: 'auto' }}>
                            {(t.comments || []).length === 0 && (
                                <Typography variant="caption" color="text.disabled" sx={{ py: 1 }}>
                                    No comments yet. Be the first to comment.
                                </Typography>
                            )}
                            {(t.comments || []).map((c, i) => (
                                <Box key={i} display="flex" gap={1.5} alignItems="flex-start">
                                    <Avatar sx={{ width: 28, height: 28, fontSize: 12, background: 'linear-gradient(135deg, #6dd5ed, #2193b0)', flexShrink: 0 }}>
                                        {(c.user?.name || c.user?.email || 'U')[0]}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Box display="flex" alignItems="center" gap={1} mb={0.25}>
                                            <Typography fontSize={12} fontWeight={700}>
                                                {c.user?.name || c.user?.email || 'User'}
                                            </Typography>
                                            <Typography fontSize={11} color="text.disabled">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            fontSize={13}
                                            sx={{ p: 1, borderRadius: 1.5, bgcolor: inputBg }}
                                        >
                                            {c.comment}
                                        </Typography>
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
                                InputProps={{ sx: { borderRadius: 2, bgcolor: inputBg, fontSize: 13 } }}
                            />
                            <IconButton
                                onClick={handleAddComment}
                                disabled={!comment.trim() || submittingComment}
                                color="primary"
                                sx={{ borderRadius: 2, alignSelf: 'flex-end' }}
                            >
                                {submittingComment ? <CircularProgress size={18} /> : <SendRoundedIcon />}
                            </IconButton>
                        </Box>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        textTransform: 'none',
                        px: 3,
                        background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                        '&:hover': { background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' },
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskDetailsDialog;
