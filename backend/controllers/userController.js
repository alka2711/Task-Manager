const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
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
            user.password = undefined; // Remove password from the response
            res.status(200).json({ token, user });
        } else {
            return res.status(401).json({ status: false, message: "Invalid email or password." });
        }
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

const getTeamList = async (req, res) => {
    try {
        const users = await User.find().select("name role email");
        res.status(200).json(users);
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ status: false, message: error.message });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getTeamList
};