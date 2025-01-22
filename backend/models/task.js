const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Activity Schema
const activitySchema = new Schema({
    status: { type: String, enum: ['pending', 'sent for review', 'completed'], default: 'pending', required: true },
    activity: { type: String },
    date: { type: Date, default: Date.now },
    by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    files: [{ type: String, default: [] }] // Default to empty array if no files are provided
}, { _id: false });

// Define the Task Schema
const taskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    taskType: { type: String, enum: ['assigned_by_individual', 'assigned_by_team'], required: true }, // Fixed enum placement
    priority: { type: String, enum: ["high", "medium", "low"], required: true },
    status: { type: String, enum: ['pending', 'sent for review', 'completed'], default: 'pending', required: true },
    dueDate: { type: Date, required: true },
    activities: [activitySchema], // Embedding the activity schema
    team: [{ type: Schema.Types.ObjectId, ref: "User", required: true }]
}, { timestamps: true });

// Create and export the Task model
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
