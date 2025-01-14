const express = require('express');
const { getNotifications } = require('../controllers/notifsController');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/notifications', authMiddleware, getNotifications);

module.exports = router;