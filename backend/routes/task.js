const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

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
        res.status(500).json({ msg: e.message });
    }
});

// Create task
router.post('/', auth, async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, createdBy: req.user.id });
        res.json(task);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// Get single task (populates assignees + comment authors)
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('comments.user', 'name email');
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        res.json(task);
    } catch (e) {
        res.status(404).json({ msg: 'Task not found' });
    }
});

// Update task
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('assignedTo', 'name email');
        res.json(task);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// Archive task
router.patch('/:id/archive', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { isArchived: true },
            { new: true }
        );
        res.json(task);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment?.trim()) return res.status(400).json({ msg: 'Comment is required' });
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        task.comments.push({ user: req.user.id, comment });
        await task.save();
        await task.populate('comments.user', 'name email');
        res.json(task.comments);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// Add subtask
router.post('/:id/subtasks', auth, async (req, res) => {
    try {
        const { title } = req.body;
        if (!title?.trim()) return res.status(400).json({ msg: 'Title is required' });
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        task.subtasks.push({ title });
        await task.save();
        res.json(task.subtasks);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// Toggle subtask completion
router.patch('/:id/subtasks/:sid', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        const subtask = task.subtasks.id(req.params.sid);
        if (!subtask) return res.status(404).json({ msg: 'Subtask not found' });
        subtask.completed = !subtask.completed;
        await task.save();
        res.json(task.subtasks);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// Bulk delete
router.post('/bulk-delete', auth, async (req, res) => {
    try {
        const { ids } = req.body;
        await Task.deleteMany({ _id: { $in: ids } });
        res.json({ msg: 'Deleted' });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Deleted' });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

module.exports = router;
