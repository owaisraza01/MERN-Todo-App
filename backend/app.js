const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// app.get('/', (req, res) => res.send('API Running'));

module.exports = app;