const Notifs = require('../models/notification');

const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notifs.find({ user: userId })
            .sort({ createdAt: -1 }) 
            .limit(10);

        res.status(200).json({ status: true, notifications });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getNotifications,
};