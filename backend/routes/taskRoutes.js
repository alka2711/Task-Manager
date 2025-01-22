const express = require('express');
const { dashboardStatistics, createAndAssignTask, getTask,getTeamAssignerTasks ,getTasks, submitTask,getAssignerTasks, reviewTask, assignTaskToTeam, getTeamTasks, getFiles, getTaskDetails, approveTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware.js'); 
const { getTeam } = require('../controllers/teamController.js');

const router = express.Router();

router.post('/create', authMiddleware, createAndAssignTask);
router.post('/submit/:taskId', authMiddleware, submitTask);
router.post('/teamAssign', authMiddleware, assignTaskToTeam);

router.get('/dashboard', authMiddleware, dashboardStatistics);
router.get('/', authMiddleware, getTasks);
router.get('/teamtasks', authMiddleware, getTeamTasks);
// router.get('/:id', authMiddleware, getTask);
router.get('/assignerTask', authMiddleware, getAssignerTasks);
router.get('/teamassignerTask', authMiddleware, getTeamAssignerTasks);
router.get('/:taskId/files', authMiddleware, getFiles);
router.get('/:taskId/details', authMiddleware, getTaskDetails);

router.get('/:taskId/approve', authMiddleware, approveTask);

module.exports = router;