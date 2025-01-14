const Notifs = require('../models/notification');
const Task = require('../models/task');
const User = require('../models/user');

const createAndAssignTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, team } = req.body;
        const assignerId = req.user._id;

        const assigner = await User.findById(assignerId);

        if (!assigner) {
            return res.status(404).json({ status: false, message: 'Assigner not found' });
        }

        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            team: [assignerId, ...team]
        });

        await task.save();

        let text = `${assigner.name} has assigned a new task to you`;
        if (task.team.length > 2) {
            text += ` and ${task.team.length - 2} others.`;
        }
        text += ` Priority: ${task.priority}. Deadline: ${new Date(task.dueDate).toDateString()}`;

        const notifications = task.team
            .filter(userId => userId.toString() !== assignerId.toString())
            .map(userId => ({
                user: userId,
                title: `Task Assigned: ${task.title}`,
                text,
                task: task._id,
                notiType: 'alert',
            }));

        await Notifs.insertMany(notifications);

        res.status(201).json({
            status: true,
            message: "Task created and assigned successfully",
            task,
            notifications,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

const submitTask = async (req, res) => {
    const { taskId } = req.params;
    const { files, status } = req.body;
    const userId = req.user._id;

    try {
        const task = await Task.findById(taskId).populate('team');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.team[0]._id.toString() === userId.toString()) {
            return res.status(403).json({ message: 'Assigners cannot submit the task they assigned' });
        }

        const newActivity = {
            status, 
            by: userId, 
            files: files || [],
        };

        task.activities.push(newActivity);

        if (status === 'completed') {
            const assignerId = task.team[0]._id;
            const assignerNotification = {
                user: assignerId,
                title: `Task Completed: ${task.title}`,
                text: `${req.user.name} has completed the task, waiting for your approval.`,
                task: task._id,
                notiType: 'alert',
            };
            await Notifs.create(assignerNotification);

            const userNotification = {
                user: userId,
                title: `Task Submitted: ${task.title}`,
                text: `Sent to ${task.team[0].name} for approval.`,
                task: task._id,
                notiType: 'alert',
            };
            await Notifs.create(userNotification);
        }

        await task.save();

        res.status(200).json({ message: 'Task activity updated', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const dashboardStatistics = async (req, res) => {
    try {
        const userId = req.user._id;

        const allTasks = await Task.find({
            team: userId,
        })
            .populate({ path: "team", select: "name role title email" })
            .sort({ _id: -1 });

        const users = await User.find({ isActive: true })
            .select("name title role createdAt")
            .limit(10)
            .sort({ _id: -1 });

        const groupTasksByStatus = allTasks.reduce((result, task) => {
            const status = task.status;

            if (!result[status]) {
                result[status] = 1;
            } else {
                result[status] += 1;
            }

            return result;
        }, {});

        const groupData = Object.entries(
            allTasks.reduce((result, task) => {
                const { priority } = task;

                result[priority] = (result[priority] || 0) + 1;
                return result;
            }, {})
        ).map(([name, total]) => ({ name, total }));

        const totalTasks = allTasks.length;
        const last10Tasks = allTasks.slice(0, 10);

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
        const task = await Task.findById(id).populate('team', 'name title email');

        if (!task) {
            return res.status(404).json({ status: false, message: 'Task not found' });
        }

        res.status(200).json({ status: true, task });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    createAndAssignTask,
    submitTask,
    dashboardStatistics,
    getTasks,
    getTask,
};