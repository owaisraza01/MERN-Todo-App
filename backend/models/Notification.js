const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['task_assigned', 'comment_added', 'status_changed'],
        default: 'task_assigned',
    },
    read: { type: Boolean, default: false },
    link: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
