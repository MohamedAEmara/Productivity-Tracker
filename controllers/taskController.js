const Task = require("../models/Task")
const User = require("../models/User")
const jwt = require('jsonwebtoken');


exports.showAllTasks = async (req, res) => {
    try {
        console.log('show alll');

        let tasks = await Task.find({ user: req.user });
        
        let taskObjs = [];
        tasks.forEach(task => {
            let taskObject = task.toObject();
            
            let time = taskObject.time;
            taskObject.hours = Math.floor(time / 3600);
            time -= taskObject.hours * 3600;
            taskObject.mins = Math.floor(time / 60);
            time -= taskObject.mins * 60;
            taskObject.secs = time;
            
            let remaining = taskObject.remainingTime;
            taskObject.rem_hours = Math.floor(remaining / 3600);
            remaining -= taskObject.rem_hours * 3600;
            taskObject.rem_mins = Math.floor(remaining / 60);
            remaining -= taskObject.rem_mins * 60;
            taskObject.rem_secs = remaining;
            
            if(taskObject.hours < 10) {
                taskObject.hours = `0${taskObject.hours}`;
            }
            if(taskObject.mins < 10) {
                taskObject.mins = `0${taskObject.mins}`;
            }
            if(taskObject.secs < 10) {
                taskObject.secs = `0${taskObject.secs}`;
            }
            if(taskObject.rem_hours < 10) {
                taskObject.rem_hours = `0${taskObject.rem_hours}`;
            }
            if(taskObject.rem_mins < 10) {
                taskObject.rem_mins = `0${taskObject.rem_mins}`;
            }
            if(taskObject.rem_secs < 10) {
                taskObject.rem_secs = `0${taskObject.rem_secs}`;
            }
            
            taskObjs.push(taskObject);
        })

        res.render('tasks', { tasks: taskObjs, hero: req.hero, page: 'All Tasks' });
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

        let taskObjs = [];
        tasks.forEach(task => {
            let taskObject = task.toObject();
            
            let time = taskObject.time;
            taskObject.hours = Math.floor(time / 3600);
            time -= taskObject.hours * 3600;
            taskObject.mins = Math.floor(time / 60);
            time -= taskObject.mins * 60;
            taskObject.secs = time;
            
            let remaining = taskObject.remainingTime;
            taskObject.rem_hours = Math.floor(remaining / 3600);
            remaining -= taskObject.rem_hours * 3600;
            taskObject.rem_mins = Math.floor(remaining / 60);
            remaining -= taskObject.rem_mins * 60;
            taskObject.rem_secs = remaining;

            if(taskObject.hours < 10) {
                taskObject.hours = `0${taskObject.hours}`;
            }
            if(taskObject.mins < 10) {
                taskObject.mins = `0${taskObject.mins}`;
            }
            if(taskObject.secs < 10) {
                taskObject.secs = `0${taskObject.secs}`;
            }
            if(taskObject.rem_hours < 10) {
                taskObject.rem_hours = `0${taskObject.rem_hours}`;
            }
            if(taskObject.rem_mins < 10) {
                taskObject.rem_mins = `0${taskObject.rem_mins}`;
            }
            if(taskObject.rem_secs < 10) {
                taskObject.rem_secs = `0${taskObject.rem_secs}`;
            }
            
            taskObjs.push(taskObject);
        })

        res.render('tasks', { tasks: taskObjs, hero: req.hero, page: 'Completed Tasks' });
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

        let taskObjs = [];
        tasks.forEach(task => {
            let taskObject = task.toObject();
            
            let time = taskObject.time;
            taskObject.hours = Math.floor(time / 3600);
            time -= taskObject.hours * 3600;
            taskObject.mins = Math.floor(time / 60);
            time -= taskObject.mins * 60;
            taskObject.secs = time;
            
            let remaining = taskObject.remainingTime;
            taskObject.rem_hours = Math.floor(remaining / 3600);
            remaining -= taskObject.rem_hours * 3600;
            taskObject.rem_mins = Math.floor(remaining / 60);
            remaining -= taskObject.rem_mins * 60;
            taskObject.rem_secs = remaining;

            if(taskObject.hours < 10) {
                taskObject.hours = `0${taskObject.hours}`;
            }
            if(taskObject.mins < 10) {
                taskObject.mins = `0${taskObject.mins}`;
            }
            if(taskObject.secs < 10) {
                taskObject.secs = `0${taskObject.secs}`;
            }
            if(taskObject.rem_hours < 10) {
                taskObject.rem_hours = `0${taskObject.rem_hours}`;
            }
            if(taskObject.rem_mins < 10) {
                taskObject.rem_mins = `0${taskObject.rem_mins}`;
            }
            if(taskObject.rem_secs < 10) {
                taskObject.rem_secs = `0${taskObject.rem_secs}`;
            }
            
            taskObjs.push(taskObject);
        })

        res.render('tasks', { tasks:taskObjs, hero: req.hero, page: 'Not-Completed Tasks' });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'fail', 
            message: 'Internal Server Error!'
        })
    }
}




exports.showAddTaskFrom = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        res.render('add', { hero: user });
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

        let taskObjs = [];
        tasks.forEach(task => {
            let taskObject = task.toObject();
            
            let time = taskObject.time;
            taskObject.hours = Math.floor(time / 3600);
            time -= taskObject.hours * 3600;
            taskObject.mins = Math.floor(time / 60);
            time -= taskObject.mins * 60;
            taskObject.secs = time;
            
            let remaining = taskObject.remainingTime;
            taskObject.rem_hours = Math.floor(remaining / 3600);
            remaining -= taskObject.rem_hours * 3600;
            taskObject.rem_mins = Math.floor(remaining / 60);
            remaining -= taskObject.rem_mins * 60;
            taskObject.rem_secs = remaining;
            
            if(taskObject.hours < 10) {
                taskObject.hours = `0${taskObject.hours}`;
            }
            if(taskObject.mins < 10) {
                taskObject.mins = `0${taskObject.mins}`;
            }
            if(taskObject.secs < 10) {
                taskObject.secs = `0${taskObject.secs}`;
            }
            if(taskObject.rem_hours < 10) {
                taskObject.rem_hours = `0${taskObject.rem_hours}`;
            }
            if(taskObject.rem_mins < 10) {
                taskObject.rem_mins = `0${taskObject.rem_mins}`;
            }
            if(taskObject.rem_secs < 10) {
                taskObject.rem_secs = `0${taskObject.rem_secs}`;
            }

            taskObjs.push(taskObject);
        })

        res.render('tasks', {tasks: taskObjs, hero: req.hero, page: 'All Tasks'})
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
        const mins = req.body.minutes;
        const secs = req.body.seconds;
        
        const rem_hours = req.body.rem_hours;
        const rem_mins = req.body.rem_minutes;
        const rem_secs = req.body.rem_seconds;

        console.log(rem_hours);
        console.log(rem_mins);
        console.log(rem_secs);
        
        const time = secs * 1 + mins * 60 + hours * 3600;
        const remaining = rem_secs * 1 + rem_mins * 60 + rem_hours * 3600;

        if(remaining > time) {
            const task = await Task.findById(req.params.taskId);
            const hero = await User.findById(req.user);
            return res.render('edit', { task, hours, mins, secs, rem_hours, rem_mins, rem_secs, hero, error: true });
        }

        let completed = false;
        if(remaining === 0) {
            completed = true;
        }

        const task = await Task.findByIdAndUpdate(req.params.taskId, { name: req.body.taskName, remainingTime: remaining, time, completed });
        console.log(task);
        const tasks = await Task.find({ user: req.user });
        console.log(tasks);
        console.log(req.user);

        let taskObjs = [];
        tasks.forEach(task => {
            let taskObject = task.toObject();
            
            let time = taskObject.time;
            taskObject.hours = Math.floor(time / 3600);
            time -= taskObject.hours * 3600;
            taskObject.mins = Math.floor(time / 60);
            time -= taskObject.mins * 60;
            taskObject.secs = time;
            
            let remaining = taskObject.remainingTime;
            taskObject.rem_hours = Math.floor(remaining / 3600);
            remaining -= taskObject.rem_hours * 3600;
            taskObject.rem_mins = Math.floor(remaining / 60);
            remaining -= taskObject.rem_mins * 60;
            taskObject.rem_secs = remaining;

            if(taskObject.hours < 10) {
                taskObject.hours = `0${taskObject.hours}`;
            }
            if(taskObject.mins < 10) {
                taskObject.mins = `0${taskObject.mins}`;
            }
            if(taskObject.secs < 10) {
                taskObject.secs = `0${taskObject.secs}`;
            }
            if(taskObject.rem_hours < 10) {
                taskObject.rem_hours = `0${taskObject.rem_hours}`;
            }
            if(taskObject.rem_mins < 10) {
                taskObject.rem_mins = `0${taskObject.rem_mins}`;
            }
            if(taskObject.rem_secs < 10) {
                taskObject.rem_secs = `0${taskObject.rem_secs}`;
            }

            taskObjs.push(taskObject);
        })

        res.render('tasks', { tasks: taskObjs, hero: req.hero, page: 'All Tasks'});
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
        const rem_hours = Math.floor(task.remainingTime / 3600);
        const rem_mins = Math.floor((task.remainingTime - rem_hours * 3600) / 60);
        const rem_secs = Math.floor(task.remainingTime - rem_hours * 3600 - 60 * rem_mins);

        const hours = Math.floor(task.time / 3600);
        const mins = Math.floor((task.time - hours * 3600) / 60);
        const secs = Math.floor(task.time - hours * 3600 - mins * 60);

        const id = req.user;
        const user = await User.findById(id);
        console.log(user);

        console.log(hours, mins, secs);
        res.render('edit', { task: task, hours, mins, secs, rem_hours, rem_mins, rem_secs, hero: user, error: false });
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
        const id = req.user;
        const user = await User.findById(id);
        
        res.render('timer', { task, hero: user });
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


exports.showProfile = async (req, res) => {
    try {
        // const tasks = await Task.find({ user: req.user });
        // console.log(tasks);
        const id = req.user;
        const user = await User.findById(id);
        res.render('profile', { hero: user });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'fail', 
            message: 'Internal Server Error!'
        })
    }
}



exports.displayMain = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        // console.log(token);
        if(!token) {
            return res.render('login');
        }
        const tmp = (jwt.decode(token, process.env.JWT_SECRET));
        // console.log(tmp);
        if(tmp.exp <= Math.floor(Date.now() / 1000)) {
            return res.render('login');
        } else {
            req.user = tmp.id;
            const tasks = await Task.find({ user: req.user });
            

            console.log(tasks);
            const hero = await User.findById(req.user);

            let taskObjs = [];
            tasks.forEach(task => {
                let taskObject = task.toObject();
                
                let time = taskObject.time;
                taskObject.hours = Math.floor(time / 3600);
                time -= taskObject.hours * 3600;
                taskObject.mins = Math.floor(time / 60);
                time -= taskObject.mins * 60;
                taskObject.secs = time;
                
                let remaining = taskObject.remainingTime;
                taskObject.rem_hours = Math.floor(remaining / 3600);
                remaining -= taskObject.rem_hours * 3600;
                taskObject.rem_mins = Math.floor(remaining / 60);
                remaining -= taskObject.rem_mins * 60;
                taskObject.rem_secs = remaining;
                
                if(taskObject.hours < 10) {
                    taskObject.hours = `0${taskObject.hours}`;
                }
                if(taskObject.mins < 10) {
                    taskObject.mins = `0${taskObject.mins}`;
                }
                if(taskObject.secs < 10) {
                    taskObject.secs = `0${taskObject.secs}`;
                }
                if(taskObject.rem_hours < 10) {
                    taskObject.rem_hours = `0${taskObject.rem_hours}`;
                }
                if(taskObject.rem_mins < 10) {
                    taskObject.rem_mins = `0${taskObject.rem_mins}`;
                }
                if(taskObject.rem_secs < 10) {
                    taskObject.rem_secs = `0${taskObject.rem_secs}`;
                }
                console.log(taskObject);
                taskObjs.push(taskObject);
            })

            return res.render('tasks', { tasks: taskObjs, hero, page: 'All Tasks' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong. Please try again later'
        });
    }
}