const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSchema = new Schema({
    name: { type: String, required: true, unique: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;