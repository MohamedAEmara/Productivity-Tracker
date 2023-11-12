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
    remainingTime: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});



const Task = mongoose.model('Task', taskSchema);
module.exports = Task;