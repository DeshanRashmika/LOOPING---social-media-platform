const express = require('express');
const router = express.Router();
const { createPost, getAllPosts } = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');
const { createPost, getAllPosts, likePost, addComment } = require('../controllers/postController');

router.post('/create', protect, createPost);
router.get('/feed', getAllPosts);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);

module.exports = router;
