const express = require('express');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const router = express.Router();

const notify = (userId, message, type, link) =>
    Notification.create({ user: userId, message, type, link }).catch(() => {});

// Get all tasks — paginated when ?page= is provided, full array otherwise
router.get('/', auth, async (req, res) => {
    const { status, assignedTo, priority, organization, page, limit, archived } = req.query;
    const query = {};
    if (!archived) query.isArchived = { $ne: true };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (organization) query.organization = organization;

    try {
        if (page) {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit) || 10;
            const [tasks, total] = await Promise.all([
                Task.find(query)
                    .populate('assignedTo', 'name email')
                    .sort({ createdAt: -1 })
                    .skip((pageNum - 1) * limitNum)
                    .limit(limitNum),
                Task.countDocuments(query),
            ]);
            return res.json({ tasks, total, page: pageNum, pages: Math.ceil(total / limitNum) });
        }
        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Create task
router.post('/', auth, async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, createdBy: req.user.id });
        const assignees = (req.body.assignedTo || []).filter(id => String(id) !== String(req.user.id));
        assignees.forEach(uid => notify(uid, `You were assigned to "${task.title}"`, 'task_assigned', task._id));
        res.json(task);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('comments.user', 'name email');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (e) {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Update task
router.put('/:id', auth, async (req, res) => {
    try {
        const prev = await Task.findById(req.params.id);
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('assignedTo', 'name email');

        if (prev && req.body.status && prev.status !== req.body.status) {
            const recipients = (task.assignedTo || [])
                .map(u => u._id)
                .filter(id => String(id) !== String(req.user.id));
            recipients.forEach(uid =>
                notify(uid, `"${task.title}" moved to ${req.body.status.replace('-', ' ')}`, 'status_changed', task._id)
            );
        }

        const prevIds = (prev?.assignedTo || []).map(String);
        const newIds = (req.body.assignedTo || []).map(String);
        const newlyAssigned = newIds.filter(id => !prevIds.includes(id) && id !== String(req.user.id));
        newlyAssigned.forEach(uid =>
            notify(uid, `You were assigned to "${task.title}"`, 'task_assigned', task._id)
        );

        res.json(task);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Archive task
router.patch('/:id/archive', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { isArchived: true }, { new: true });
        res.json(task);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment?.trim()) return res.status(400).json({ message: 'Comment is required' });
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        task.comments.push({ user: req.user.id, comment });
        await task.save();
        await task.populate('comments.user', 'name email');

        const recipients = new Set([
            ...(task.assignedTo || []).map(String),
            task.createdBy ? String(task.createdBy) : null,
        ].filter(id => id && id !== String(req.user.id)));
        const commenterName = req.user.name || req.user.email || 'Someone';
        recipients.forEach(uid =>
            notify(uid, `${commenterName} commented on "${task.title}"`, 'comment_added', task._id)
        );

        res.json(task.comments);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Add subtask
router.post('/:id/subtasks', auth, async (req, res) => {
    try {
        const { title } = req.body;
        if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        task.subtasks.push({ title });
        await task.save();
        res.json(task.subtasks);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Toggle subtask completion
router.patch('/:id/subtasks/:sid', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        const subtask = task.subtasks.id(req.params.sid);
        if (!subtask) return res.status(404).json({ message: 'Subtask not found' });
        subtask.completed = !subtask.completed;
        await task.save();
        res.json(task.subtasks);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Bulk delete
router.post('/bulk-delete', auth, async (req, res) => {
    try {
        const { ids } = req.body;
        await Task.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Deleted' });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

module.exports = router;
