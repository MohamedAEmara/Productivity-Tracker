const mongoose = require('mongoose');



const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
    },
    time: {
        type: Number,
        required: true,
    },
    remainingTime: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});



const Task = mongoose.model('Task', taskSchema);
module.exports = Task;