const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const Task = require('../models/task');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, role, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser  = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ status: false, message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            user.password = undefined; 
            res.status(200).json({ token, user });
        } else {
            return res.status(401).json({ status: false, message: "Invalid email or password." });
        }
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


const getTeamListByTaskId = async (req, res) => {
    try {
        const { taskId } = req.params; 
        const userId = req.user._id; 

        const task = await Task.findById(taskId).populate('team', 'name role email');

        if (!task) {
            return res.status(404).json({ status: false, message: 'Task not found' });
        }

        const isUserAssigned = task.team.some(member => member._id.toString() === userId.toString());

        if (!isUserAssigned) {
            return res.status(403).json({ status: false, message: 'Forbidden, you are not assigned to this task' });
        }

        const teamMembers = task.team;

        res.status(200).json(teamMembers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getTeamListByTaskId, 
};
