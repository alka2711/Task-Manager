const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new Schema({
    status: { type: String, enum: ['pending', 'sent for review', 'completed'], default: 'pending', required: true },
    activity: { type: String },
    date: { type: Date, default: Date.now },
    by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    files: [{ type: String }]
}, { _id: false });

const taskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    priority: { type: String, enum: ["high", "medium", "low"] , required: true},
    status: { type: String, enum: ['pending', 'sent for review', 'completed'], default: 'pending', required: true },
    dueDate: { type: Date, required: true },
    activities: [activitySchema],
    team: [{ type: Schema.Types.ObjectId, ref: "User" , required: true}]
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;