const express = require('express');
const { createTeam, getTeam, getUserTeams, joinTeam } = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, createTeam);
router.get('/:id', authMiddleware, getTeam);
router.get('/', authMiddleware, getUserTeams); // Add this route
router.post('/join', authMiddleware, joinTeam); // Add this route


module.exports = router;