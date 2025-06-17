const express = require('express'); // <-- Add this!
const path = require('path');       // <-- Add this!
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error(err);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// For any other routes, serve the React index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});