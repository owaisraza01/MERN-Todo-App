import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Stack,
    Chip,
    Box,
    Avatar,
    Divider,
    useTheme
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';

const statusColors = {
    pending: 'warning',
    'in-progress': 'info',
    inprogress: 'info',
    completed: 'success'
};

const priorityColors = {
    low: 'default',
    medium: 'warning',
    high: 'error'
};

const TaskDetailsDialog = ({ task, onClose }) => {
    const theme = useTheme();
    if (!task) return null;

    // Adaptive backgrounds
    const glassBg = theme.palette.mode === 'dark'
        ? 'rgba(34, 40, 49, 0.98)'
        : 'rgba(255,255,255,0.98)';
    const descriptionBg = theme.palette.mode === 'dark'
        ? 'rgba(44,62,80,0.88)'
        : '#f6f9ff';
    const descriptionColor = theme.palette.mode === 'dark'
        ? theme.palette.grey[200]
        : '#34495e';

    return (
        <Dialog
            open={Boolean(task)}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 5,
                    background: glassBg,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 12px 48px 0 #000b'
                        : '0 12px 48px 0 rgba(33,147,176,0.13)',
                    p: 1,
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 900,
                    letterSpacing: '-1px',
                    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                    color: theme.palette.primary.main,
                }}
            >
                <InfoOutlinedIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Task Details
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <LabelImportantIcon color="secondary" sx={{ fontSize: 26 }} />
                        <Typography variant="h6" fontWeight={900} sx={{
                            fontFamily: 'Inter, Roboto, Arial, sans-serif',
                            color: theme.palette.text.primary,
                            letterSpacing: '-0.5px'
                        }}>
                            {task.title}
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            bgcolor: descriptionBg,
                            borderRadius: 3,
                            px: 2,
                            py: 1.2,
                            fontSize: 16,
                            color: descriptionColor,
                            fontWeight: 500,
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 1px 4px #0005'
                                : '0 1px 4px #2193b01a'
                        }}
                    >
                        {task.description}
                    </Typography>
                    <Divider />
                    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" justifyContent="flex-start">
                        <Chip
                            icon={<FlagIcon />}
                            label={`Priority: ${task.priority?.[0]?.toUpperCase()}${task.priority?.slice(1) || ''}`}
                            color={priorityColors[task.priority] || 'default'}
                            sx={{
                                fontWeight: 600,
                                fontSize: 15,
                                bgcolor: theme.palette.mode === 'dark' && task.priority === 'low'
                                    ? theme.palette.grey[800]
                                    : undefined,
                                color: task.priority === 'low' && theme.palette.mode === 'dark'
                                    ? theme.palette.text.secondary
                                    : undefined
                            }}
                        />
                        <Chip
                            icon={<AccessTimeIcon />}
                            label={`Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '--'}`}
                            color="info"
                            sx={{ fontWeight: 600, fontSize: 15 }}
                        />
                        <Chip
                            icon={<AssignmentIndIcon />}
                            label={`Status: ${task.status?.replace('-', ' ')}`}
                            color={statusColors[task.status] || 'default'}
                            sx={{ fontWeight: 600, fontSize: 15 }}
                        />
                    </Box>
                    <Divider />
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                            Assignees
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {(task.assignedTo || []).length === 0 && (
                                <Chip label="Unassigned" size="small" />
                            )}
                            {(task.assignedTo || []).map(u => (
                                <Chip
                                    key={u._id}
                                    avatar={
                                        u.avatar
                                            ? <Avatar src={u.avatar} alt={u.name || u.email} />
                                            : <Avatar>{(u.name || u.email || 'U')[0]}</Avatar>
                                    }
                                    label={u.name || u.email}
                                    size="medium"
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : '#f8fbff',
                                        color: theme.palette.text.primary,
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        borderRadius: 3,
                        px: 3,
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
                        textTransform: 'none',
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 1px 6px #0004'
                            : '0 2px 8px 0 #2193b022',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)',
                        },
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskDetailsDialog;