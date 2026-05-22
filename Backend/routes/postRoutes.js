const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, likePost, addComment } = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');

router.post('/create', protect, createPost);
router.get('/feed', getAllPosts);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);

module.exports = router;
