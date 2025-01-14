const express = require('express');
const { registerUser, loginUser, getTeamList } = require('../controllers/userController.js');

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/teamList", getTeamList);

module.exports = router;