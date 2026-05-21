const express = require('express');
const router = express.Router();
const { createPost, getAllPosts } = require('../controllers/postController');
const protect = require('../middleware/authMiddleware'); 

router.post('/create', protect, createPost);
router.get('/feed', getAllPosts); 

module.exports = router;