const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken.js');
const User = require('../models/user.js');
const Task = require('../models/task');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 8, required: true },
}, { timestamps: true });

// Method to compare plain text password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        console.log('Registering user:', { name, email, role });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, role, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);

            res.status(201).json({
                message: 'User logged in successfully',
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

const getUser = async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findById(req.user._id); // Fetch user data from DB
        if (user) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
          });
        }
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(401).json({ message: 'Not authorized' });
    } catch (error) {
      console.error('Error in getUser:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
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
    logoutUser,
    getUser,
    updateUser
    // getTeamListByTaskId,
};
