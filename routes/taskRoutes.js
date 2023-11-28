const express = require('express');
const taskRouter = express.Router();


const { showAllTasks, showCompletedTasks, showNotCompletedTasks } = require('../controllers/taskController');
const { isAuthenticated } = require('../middlewares/isAuthenticated');


taskRouter.use(isAuthenticated); 

taskRouter.get('/all', showAllTasks);
taskRouter.get('/completed', showCompletedTasks);
taskRouter.get('/notCompleted', showNotCompletedTasks);



module.exports = taskRouter