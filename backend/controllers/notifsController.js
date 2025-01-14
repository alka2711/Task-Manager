const Notifs = require('../models/notification');
const Task = require('../models/task');
const moment = require('moment');

const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch notifications for the user
        const notifications = await Notifs.find({ user: userId, isRead: { $ne: userId } })
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
        const userId = req.user._id;

        // Update the notification's `isRead` field
        await Notifs.findByIdAndUpdate(notificationId, {
            $addToSet: { isRead: userId },
        });

        res.status(200).json({ status: true, message: "Notification marked as read" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

const deadlineNotifs = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get the current date and the date for one week from now
        const currentDate = moment();
        const oneWeekFromNow = moment().add(7, 'days');

        // Find tasks due within the next week
        const tasksDueSoon = await Task.find({
            dueDate: { $gte: currentDate.toDate(), $lte: oneWeekFromNow.toDate() },
            status: { $ne: 'completed' }
        }).populate('team');

        // Create notifications for each task due soon
        const notifications = [];
        for (const task of tasksDueSoon) {
            const notificationText = `Reminder: The task "${task.title}" is due on ${moment(task.dueDate).format('MMMM Do YYYY')}.`;
            const notificationTitle = `Task Deadline Reminder: ${task.title}`;

            // Create a notification for each user in the team
            for (const userId of task.team) {
                notifications.push({
                    title: notificationTitle,
                    team: [userId],
                    text: notificationText,
                    task: task._id,
                    notiType: 'alert',
                });
            }
        }

        // Save notifications to the database
        await Notifs.insertMany(notifications);

        res.status(200).json({
            status: true,
            notifications,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    deadlineNotifs,
};