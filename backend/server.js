require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postsRouter = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Body parser for JSON data

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process if connection fails
    });

// Routes
app.use('/api/posts', postsRouter);

// Simple root route
app.get('/', (req, res) => {
    res.send('Blogging Platform API is running!');
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));