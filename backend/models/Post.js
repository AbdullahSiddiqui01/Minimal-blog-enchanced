const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
        default: 'Anonymous'
    },
    createdAt: {
        type: Date,
        default: Date.now // Timestamp requirement met here
    }
});

module.exports = mongoose.model('Post', PostSchema);