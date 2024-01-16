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
        res.render('tasks', { tasks, hero: req.hero, page: 'All Tasks' });
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
        res.render('tasks', { tasks, hero: req.hero, page: 'Completed Tasks' });
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
        res.render('tasks', { tasks, hero: req.hero, page: 'Not-Completed Tasks' });
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
        res.render('tasks', {tasks, hero: req.hero, page: 'All Tasks'})
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


// =========================================== NOT COMPLELETED =========================================== //
exports.editTask = async (req, res) => {
    try {
        const name = req.body.taskName;
        const hours = req.body.hours;
        const minutes = req.body.minutes;
        const seconds = req.body.seconds;
        
        console.log(req.params.taskId);
        console.log(req.body);

        const time = seconds * 1 + minutes * 60 + hours * 3600;
        let completed = false;
        if(time === 0) {
            completed = true;
        }
        console.log(req.params.taskId);
        console.log(typeof req.params.taskId);
        
        const task = await Task.findByIdAndUpdate(req.params.taskId, { name: req.body.taskName, remainingTime: time, completed });
        console.log(task);
        const tasks = await Task.find();
        res.render('tasks', { tasks, hero: req.hero, page: 'All Tasks'});
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        })
    }
}


exports.updateTask = async (req, res) => {
    try {
        // const task = await Task.findByIdAndUpdate(req.params.taskId, req.body);
        // console.log(task);
        // res.send(task);
        const task = await Task.findById(req.params.taskId);
        console.log(task);
        const hours = Math.floor(task.remainingTime / 3600);
        const mins = Math.floor((task.remainingTime - hours * 3600) / 60);
        const secs = Math.floor(task.remainingTime - hours * 3600 - 60 * mins);


        console.log(hours, mins, secs);
        res.render('edit', { task: task, hours, mins, secs });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }
}


exports.displayTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        res.render('timer', { task });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }
}


exports.startTask = (req, res) => {
    try {
        const express = require('express');
        const app = express();
        const httpServer = require('http').createServer(app); // Create an HTTP server
        const io = require('socket.io')(httpServer); // Integrate Socket.io with the HTTP server

        io.on('connection', (socket) => {
            console.log(`A user connected: ${socket.id}`);
        
            // Send a message to the client every 5 seconds
            const interval = setInterval(() => {
                socket.emit('message', 'Server: Hello from server!');
            }, 5000);
        
            socket.on('two-sec', () => {
                console.log('2 seconds passed!!');
            })
            // Listen for disconnect event
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
                clearInterval(interval); // Stop sending messages on disconnect
            });
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }
}