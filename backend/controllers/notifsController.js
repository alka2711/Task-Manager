const Notifs = require('../models/notification.js');
const cron = require('node-cron');
const moment = require('moment'); // For easier date handling

// Cron job to run every Sunday at midnight
cron.schedule('0 0 * * 0', async () => {
  try {
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();

    // Fetch tasks with deadlines in the current week
    const tasksDue = await Task.find({
      deadline: { $gte: startOfWeek, $lte: endOfWeek },
    }).populate('assignedTo', 'name'); // Assuming tasks are assigned to users

    tasksDue.forEach(async (task) => {
      const notification = {
        user: task.assignedTo._id, // Notify the assigned user
        title: `Task Deadline Reminder: ${task.title}`,
        text: `Your task "${task.title}" is due on ${moment(task.deadline).format('MMMM Do YYYY')}.`,
        task: task._id,
        notiType: 'deadline',
      };

      await Notifs.create(notification);
    });

    console.log(`Weekly deadline notifications sent: ${tasksDue.length} tasks.`);
  } catch (error) {
    console.error('Error sending weekly notifications:', error);
  }
});


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