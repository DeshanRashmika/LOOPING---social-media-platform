const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        
        const newPost = new Post({
            userId: req.user.id,
            content
        });

        await newPost.save();
        res.status(201).json({ message: "Post sheared successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.getAllPosts = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 10;         const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate('userId', 'username bio')
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit);

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }

        if (post.likes.includes(req.user.id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
            await post.save();
            return res.status(200).json({ message: "Post unlike successful", likesCount: post.likes.length });
        } else {
            post.likes.push(req.user.id);
            await post.save();
            return res.status(200).json({ message: "Post liked successfully", likesCount: post.likes.length });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;

        if (!text) {
            return res.status(400).json({ message: "Comment cannot be empty!" });
        }

        const newComment = new Comment({
            postId,
            userId: req.user.id,
            text
        });

        await newComment.save();
        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
