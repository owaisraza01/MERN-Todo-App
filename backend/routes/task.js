const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Create Task
router.post('/', auth, async (req, res) => {
    try {
        const newTask = await Task.create({
            ...req.body,
            createdBy: req.user.id,
            organization: req.body.organization
        });
        res.json(newTask);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// Get all tasks (with filters)
router.get('/', auth, async (req, res) => {
    const { status, assignedTo, priority, organization } = req.query;
    const query = {};
    if (organization) query.organization = organization;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    try {
        const tasks = await Task.find(query).populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
        res.json(task);
    } catch (e) {
        res.status(404).json({ msg: 'Task not found' });
    }
});

// Update Task
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Deleted' });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

module.exports = router;