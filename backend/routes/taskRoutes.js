const express = require('express');
const { dashboardStatistics, createTask, getTask, getTasks, submitTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware.js'); 

const router = express.Router();

router.post("/create", authMiddleware, createTask);
router.post("/submit/:taskId", authMiddleware, submitTask); 
router.get("/dashboard", authMiddleware, dashboardStatistics);
router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTask);

module.exports = router;