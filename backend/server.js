const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors'); // Import CORS
const cookieParser = require('cookie-parser');
const { dbConnection } = require("./utils/index.js");
const userRoutes = require('./routes/userRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');
const notifsRoutes = require('./routes/notifsRoutes.js');

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 4444;

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Configure CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/notifs', notifsRoutes);

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));