const Task = require("../models/Task")




exports.showAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ 
            $and: [
                { user: req.user },
                { completed: { $ne: true} }
            ]
        });
        // const tasks = await Task.find({ user: req.user });
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