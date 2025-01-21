const express = require('express');
const { dashboardStatistics, createAndAssignTask, getTask, getTasks, submitTask, reviewTask, assignTaskToTeam } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware.js'); 

const router = express.Router();

router.post('/create', authMiddleware, createAndAssignTask);
router.post('/submit/:taskId', authMiddleware, submitTask);
router.post('/teamAssign', authMiddleware, assignTaskToTeam);

router.get('/dashboard', authMiddleware, dashboardStatistics);
router.get('/', authMiddleware, getTasks);
router.get('/:id', authMiddleware, getTask);

module.exports = router;