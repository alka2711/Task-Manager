const Team = require('../models/team');
const User = require('../models/user');

const createTeam = async (req, res) => {
    try {
        const { name, userEmails } = req.body;
        const assignerId = req.user._id; // Extract assigner ID from token

        const existingTeam = await Team.findOne({ name });
        if (existingTeam) {
            return res.status(400).json({ message: 'Team name already exists' });
        }

        const emailArray = userEmails.split(',').map(email => email.trim());
        const users = await User.find({ email: { $in: emailArray } });

        if (users.length !== emailArray.length) {
            return res.status(404).json({ message: 'One or more users not found' });
        }

        // Include assigner ID in the users array
        const userIds = users.map(user => user._id);
        userIds.unshift(assignerId);
        
        const team = new Team({ name, users: userIds });
        await team.save();

        // Update users to include the team reference
        await User.updateMany(
            { _id: { $in: userIds } },
            { $set: { team: team._id } }
        );

        res.status(201).json({ message: 'Team created successfully', team });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findById(id).populate('users', 'name email role');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.status(200).json({ team });
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserTeams = async (req, res) => {
    try {
        const userId = req.user._id; // Extract user ID from token

        const user = await User.findById(userId).populate('team');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const teams = await Team.find({ users: user._id }).populate('users', 'name email');

        const userTeams = teams.map(team => {
            const isAdmin = team.users[0].equals(user._id);
            return {
                ...team.toObject(),
                role: isAdmin ? 'Admin' : 'Member'
            };
        });

        res.status(200).json({ teams: userTeams });
    } catch (error) {
        console.error('Error fetching user teams:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const joinTeam = async (req, res) => {
    try {
        const { teamName } = req.body;
        const userId = req.user._id; // Extract user ID from token

        const team = await Team.findOne({ name: teamName });

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if the user is already in the team
        if (team.users.includes(userId)) {
            return res.status(400).json({ message: 'User already in the team' });
        }

        // Add the user to the team
        team.users.push(userId);
        await team.save();

        // Update the user to include the team reference
        await User.findByIdAndUpdate(userId, { $set: { team: team._id } });

        res.status(200).json({ message: 'Joined team successfully', team });
    } catch (error) {
        console.error('Error joining team:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createTeam,
    getTeam,
    getUserTeams,
    joinTeam, // Export the new function
};
