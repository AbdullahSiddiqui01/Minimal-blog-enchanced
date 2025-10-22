const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// @route   GET /api/posts
// @desc    Get all posts (Read All)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/posts
// @desc    Create a new post (Create)
router.post('/', async (req, res) => {
    const { title, content, author } = req.body;
    const newPost = new Post({ title, content, author });

    try {
        const post = await newPost.save();
        res.status(201).json(post); // 201 Created status
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID (Read Single)
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/posts/:id
// @desc    Update a post (Update)
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post (Delete)
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        // Return 204 No Content for successful deletion, or 200 with a message
        res.status(200).json({ message: 'Post removed successfully' }); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;