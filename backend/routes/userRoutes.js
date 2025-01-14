const express = require('express');
const { registerUser, loginUser, getTeamList, getTeamListByTaskId } = require('../controllers/userController.js');
const authMiddleware = require('../middlewares/authMiddleware.js'); 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/teamList/:taskId', authMiddleware, getTeamListByTaskId); 

module.exports = router;