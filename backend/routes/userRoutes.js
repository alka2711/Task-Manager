const express = require('express');
const { registerUser, loginUser, logoutUser, getUser, updateUser } = require('../controllers/userController.js');
const authMiddleware = require('../middlewares/authMiddleware.js'); 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/profile', authMiddleware, getUser);
router.get('/update', authMiddleware, updateUser);
// router.get('/teamList/:taskId', authMiddleware, getTeamListByTaskId); 

module.exports = router;