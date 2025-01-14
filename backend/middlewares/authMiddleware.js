const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token

    if (!token) {
      return res.status(401).json({ status: false, message: 'Unauthorized, token missing' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ status: false, message: 'Server error, JWT secret missing' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Decode token

    const user = await User.findById(decodedToken.id); // Find user from DB
    if (!user) {
      return res.status(401).json({ status: false, message: 'Unauthorized, user not found' });
    }

    req.user = { _id: user._id, email: user.email }; // Attach user to req
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ status: false, message: 'Unauthorized, invalid token' });
  }
};

module.exports = protectRoute;
