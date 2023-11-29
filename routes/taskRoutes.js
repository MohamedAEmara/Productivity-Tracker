const express = require('express');
const taskRouter = express.Router();


const { showAllTasks, showCompletedTasks, showNotCompletedTasks, showAddTaskFrom, showTask, createTask, deleteTask, updateTask } = require('../controllers/taskController');
const { isAuthenticated } = require('../middlewares/isAuthenticated');


taskRouter.use(isAuthenticated); 

// CRUD operations for tasks:
taskRouter
    .route('/')
    .post(createTask)
    

// taskRouter
//     .route('/:taskId')
//     .get(showTask)
//     .patch(updateTask)
//     .delete(deleteTask);


taskRouter





taskRouter.get('/all', showAllTasks);
taskRouter.get('/completed', showCompletedTasks);
taskRouter.get('/notCompleted', showNotCompletedTasks);
taskRouter.get('/add', showAddTaskFrom);




module.exports = taskRouter