const Notifs = require('../models/notification');
const Task = require('../models/task');
const User = require('../models/user');
const Team = require('../models/team');

const createAndAssignTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, userEmails } = req.body;
        const assignerId = req.user._id;

        const assigner = await User.findById(assignerId);

        if (!assigner) {
            return res.status(404).json({ status: false, message: 'Assigner not found' });
        }

        const emailArray = userEmails.split(',').map(email => email.trim());
        const users = await User.find({ email: { $in: emailArray } });

        if (users.length !== emailArray.length) {
            return res.status(404).json({ status: false, message: 'One or more users not found' });
        }

        const userIds = users.map(user => user._id);

        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            team: [assignerId, ...userIds]
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
            status: 'sent for review',
            by: userId, 
            files: files || [],
        };

        task.activities.push(newActivity);
        task.status = 'sent for review';

        
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
                text: `Sent to ${task.team[0].name} for review.`,
                task: task._id,
                notiType: 'alert',
            };
            await Notifs.create(userNotification);
        

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

        // Fetch all tasks where the user is in the team but not at the 0th index
        const allTasks = await Task.find({
            "team.0": { $ne: userId },
            team: userId,
             // Ensure the user is not at the 0th index
        })
            .populate({ path: "team", select: "name role title email" })
            .sort({ _id: -1 });

        // Fetch active users
        const users = await User.find({ isActive: true })
            .select("name title role createdAt")
            .limit(10)
            .sort({ _id: -1 });

        // Group tasks by their status
        const groupTasksByStatus = allTasks.reduce((result, task) => {
            const status = task.status;

            if (!result[status]) {
                result[status] = 1;
            } else {
                result[status] += 1;
            }

            return result;
        }, {});

        // Group tasks by their priority for graph data
        const groupData = Object.entries(
            allTasks.reduce((result, task) => {
                const { priority } = task;

                result[priority] = (result[priority] || 0) + 1;
                return result;
            }, {})
        ).map(([name, total]) => ({ name, total }));

        // Prepare summary
        const totalTasks = allTasks.length;
        const last10Tasks = allTasks.slice(0, 10);

        const summary = {
            totalTasks,
            last10Tasks,
            users,
            tasks: groupTasksByStatus,
            graphData: groupData,
        };

        // Return the response
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
        const { search, sort } = req.query;
        const userId = req.user._id; // Get the logged-in user's ID
        let query = {
            "team.0": { $ne: userId },
            team: userId, // Include only tasks where the user is part of the team
        };

        if (search) {
            query = {
                ...query,
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ],
            };
        }

        let sortOption = {};
        if (sort === 'priority') {
            sortOption = { priority: 1 }; // Sort by priority ascending
        } else if (sort === 'status') {
            sortOption = { status: 1 }; // Sort by status ascending
        }

        const tasks = await Task.find(query).sort(sortOption);
        res.json({ tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
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

const assignTaskToTeam = async (req, res) => {
    try {
        const { title, description, priority, dueDate, teamName } = req.body; // Accept team name from input
        const assignerId = req.user._id; // Logged-in user's ID

        // Fetch the assigner's user details
        const assigner = await User.findById(assignerId);
        if (!assigner) {
            return res.status(404).json({
                status: false,
                message: "Assigner not found",
            });
        }

        // Fetch the team based on team name
        const team = await Team.findOne({ name: teamName }); // Assuming you have a Team model
        if (!team) {
            return res.status(404).json({
                status: false,
                message: "Team not found",
            });
        }

        // Ensure the assigner is at the 0th index of the team
        if (team.users[0].toString() !== assignerId.toString()) {
            return res.status(403).json({
                status: false,
                message: "Only the primary team member (0th index) can assign tasks",
            });
        }

        // Get all team members excluding the assigner
        const teamMembers = team.users.filter(userId => userId.toString() !== assignerId.toString());

        if (!teamMembers || teamMembers.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No team members found to assign the task",
            });
        }

        // Create the task with the assigner and team members
        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            team: [assignerId, ...teamMembers], // Include assigner and team members
        });

        await task.save();

        // Notify all team members except the assigner
        const notifications = teamMembers.map(userId => ({
            user: userId,
            title: `${teamName} : New Team Task Assigned: ${task.title}`,
            text: `A new task has been assigned to your team by ${req.user.name}. Priority: ${priority}. Deadline: ${new Date(dueDate).toDateString()}.`,
            task: task._id,
            notiType: 'alert',
        }));

        await Notifs.insertMany(notifications);

        res.status(201).json({
            status: true,
            message: "Task successfully assigned to the team",
            task,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message,
        });
    }
};



module.exports = {
    createAndAssignTask,
    submitTask,
    dashboardStatistics,
    getTasks,
    getTask,
    assignTaskToTeam,
};