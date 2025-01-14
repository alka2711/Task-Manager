const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 8, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;