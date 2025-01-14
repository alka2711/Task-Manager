const express = require('express');
const { deadlineNotifs, getNotifications, markNotificationAsRead } = require("../controllers/notifsController");
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get("/deadline", authMiddleware, deadlineNotifs);
router.get("/notifications", authMiddleware, getNotifications);
router.post("/read", authMiddleware, markNotificationAsRead);

module.exports = router;