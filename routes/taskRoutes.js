const express = require('express');
const taskRouter = express.Router();


const { showAllTasks, showCompletedTasks, showNotCompletedTasks, showAddTaskFrom, showTask, createTask, deleteTask, updateTask, editTask, displayTask } = require('../controllers/taskController');
const { isAuthenticated } = require('../middlewares/isAuthenticated');


// taskRouter.use(isAuthenticated); 

// CRUD operations for tasks:
taskRouter
    .route('/')
    .post(isAuthenticated, createTask)
    
taskRouter.patch('/:taskId/update', editTask);

taskRouter
    .route('/:taskId')
    // .get(showTask)
    .patch(isAuthenticated, updateTask)
    .delete(isAuthenticated, deleteTask, showAllTasks);


taskRouter





taskRouter.get('/all',isAuthenticated, showAllTasks);
taskRouter.get('/completed',isAuthenticated, showCompletedTasks);
taskRouter.get('/notCompleted',isAuthenticated, showNotCompletedTasks);
taskRouter.get('/add',isAuthenticated, showAddTaskFrom);
taskRouter.get('/:taskId', isAuthenticated, displayTask);



module.exports = taskRouter