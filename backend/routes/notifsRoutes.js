const express = require('express');
const { getNotifications, markNotificationAsRead } = require('../controllers/notifsController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/notifications', authMiddleware, getNotifications);
router.get('/read', authMiddleware, markNotificationAsRead);

module.exports = router;