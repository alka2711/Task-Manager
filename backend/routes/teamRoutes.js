const express = require('express');
const { createTeam, getTeam, getUserTeams } = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, createTeam);
router.get('/:id', authMiddleware, getTeam);
router.get('/', authMiddleware, getUserTeams); // Add this route

module.exports = router;