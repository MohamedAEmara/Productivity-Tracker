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

taskSchema.pre('save', async function (next) {
    this.remainingTime = this.time;
    this.completed = this.remainingTime === 0;
})


const Task = mongoose.model('Task', taskSchema);
module.exports = Task;