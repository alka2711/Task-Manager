const Notifs = require('../models/notification');
const Task = require('../models/task');
const User = require('../models/user');

const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, team } = req.body;

        // Create the task
        const task = await Task.create({ title, description, team, dueDate, priority });

        // Prepare notification text
        let text = "New task has been assigned to you";
        if (task.team.length > 1) {
            text += ` and ${task.team.length - 1} others.`;
        }
        text += ` Priority: ${task.priority}. Deadline: ${new Date(task.dueDate).toDateString()}`;

        // Create notifications for each team member
        const notifications = team.map(userId => ({
            user: userId,
            text,
            task: task._id,
        }));

        // Save all notifications
        await Notifs.insertMany(notifications);

        // Respond to the client with created task and notifications
        res.status(201).json({
            status: true,
            message: "Task created successfully",
            task,
            notifications,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

const submitTask = async (req, res) => {
    const { taskId } = req.params; // Extract taskId from URL parameters
    const { files, status } = req.body; // Extract files and status from request body
    const userId = req.user._id; // Extract userId from authenticated user

    try {
        const task = await Task.findById(taskId); // Find the task by ID

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const newActivity = {
            status, 
            by: userId, 
            files: files || [],
        };

        task.activities.push(newActivity); // Add new activity to the task
        await task.save(); // Save the updated task

        res.status(200).json({ message: 'Task activity updated', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const dashboardStatistics = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all tasks for the user
        const allTasks = await Task.find({
            team: userId,
        })
            .populate({ path: "team", select: "name role title email" })
            .sort({ _id: -1 });

        // Fetch active users (limit to 10)
        const users = await User.find({ isActive: true })
            .select("name title role createdAt")
            .limit(10)
            .sort({ _id: -1 });

        // Group tasks by status and calculate counts
        const groupTasksByStatus = allTasks.reduce((result, task) => {
            const status = task.status;

            if (!result[status]) {
                result[status] = 1;
            } else {
                result[status] += 1;
            }

            return result;
        }, {});

        // Group tasks by priority
        const groupData = Object.entries(
            allTasks.reduce((result, task) => {
                const { priority } = task;

                result[priority] = (result[priority] || 0) + 1;
                return result;
            }, {})
        ).map(([name, total]) => ({ name, total }));

        // Calculate total tasks and last 10 tasks
        const totalTasks = allTasks.length;
        const last10Tasks = allTasks.slice(0, 10);

        // Prepare summary
        const summary = {
            totalTasks,
            last10Tasks,
            users,
            tasks: groupTasksByStatus,
            graphData: groupData,
        };

        res.status(200).json({
            status: true,
            message: "Successfully retrieved statistics",
            ...summary,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const { stage } = req.query;

        let query = {};

        if (stage) {
            query.stage = stage;
        }

        let queryResult = Task.find(query)
            .populate({
                path: "team",
                select: "name title email",
            })
            .sort({ _id: -1 });

        const tasks = await queryResult;

        res.status(200).json({
            status: true,
            tasks,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

const getTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id)
            .populate({
                path: "team",
                select: "name title role email",
            })
            .populate({
                path: "activities.by",
                select: "name",
            });

        if (!task) {
            return res.status(404).json({ status: false, message: "Task not found" });
        }

        res.status(200).json({
            status: true,
            task,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    createTask,
    submitTask,
    dashboardStatistics,
    getTasks,
    getTask
};