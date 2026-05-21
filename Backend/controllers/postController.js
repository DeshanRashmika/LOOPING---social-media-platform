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
