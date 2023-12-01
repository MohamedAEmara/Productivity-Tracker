const Task = require("../models/Task")




exports.showAllTasks = async (req, res) => {
    try {
        console.log('show alll');
        // const tasks = await Task.find({ 
        //     $and: [
        //         { user: req.user },
        //         { completed: { $ne: true} }
        //     ]
        // });
        const tasks = await Task.find({ user: req.user });
        // console.log(tasks);
        res.render('tasks', { tasks, page: 'All Tasks' });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'fail', 
            message: 'Internal Server Error!'
        })
    }
}




exports.showCompletedTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ 
            $and: [
                { user: req.user },
                { completed: true }
            ]
        });
        res.render('tasks', { tasks, page: 'Completed Tasks' });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'fail', 
            message: 'Internal Server Error!'
        })
    }
}




exports.showNotCompletedTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ 
            $and: [
                { user: req.user },
                { completed: { $ne: true} }
            ]
        });
        res.render('tasks', { tasks, page: 'Not-Completed Tasks' });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'fail', 
            message: 'Internal Server Error!'
        })
    }
}




exports.showAddTaskFrom = (req, res) => {
    try {
        res.render('add');
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'fail', 
            message: 'Internal Server Error!'
        })
    }
}




exports.createTask = async (req, res) => {
    try {
        const name = req.body.taskName;
        const hours = req.body.hours;
        const minutes = req.body.minutes;
        const seconds = req.body.seconds;

        const time = seconds * 1 + minutes * 60 + hours * 3600;

        const task = await Task.create({
            name, 
            time,
            user: req.user
        });
        
        console.log('Task Created Successfully!');  
        const tasks = await Task.find({ user: req.user });
        res.render('tasks', {tasks, page: 'All Tasks'})
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: 'Bad Request'
        });
    }
}


exports.deleteTask = async (req, res, next) => {
    try {
        await Task.findByIdAndDelete(req.params.taskId);
        console.log('task deleted successfully');
        const tasks = await Task.find({ user: req.user });
        console.log(tasks);

        next();

    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 'fail',
            message: 'Cannot delete task!',
            error: err
        });
    }
}


// exports.showTask = null;

// exports.deleteTask = null;
// exports.updateTask = null;