const Notifs = require('../models/notification.js');

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

const markNotificationAsRead = async (req, res) => {
    try {
      const { notificationId } = req.body;
      const userId = req.user._id; // Assuming user is authenticated, userId is part of req.user
      // Update the notification's `isRead` field
      await Notifs.findByIdAndUpdate(notificationId, {
        $addToSet: { isRead: userId }, // Adds the userId to the isRead array if not already present
      });
      res.status(200).json({ status: true, message: "Notification marked as read" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
  };
  

module.exports = {
    getNotifications,
    markNotificationAsRead,
};