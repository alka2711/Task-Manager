const mongoose = require('mongoose');
const { Schema } = mongoose;

const notifSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    text: { type: String, required: true },
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    notiType: { type: String, default: "alert", enum: ["alert", "message"] },
    isRead: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const Notifs = mongoose.model("Notifs", notifSchema);
module.exports = Notifs;