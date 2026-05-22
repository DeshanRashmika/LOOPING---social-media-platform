const User = require('../models/user');
const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  sharp = null;
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (!req.user || (req.user.id !== req.params.id && req.user._id !== req.params.id)) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const allowed = ['username', 'bio', 'isPrivate', 'showEmail', 'email'];
    const updates = {};
    allowed.forEach((field) => {
      if (typeof req.body[field] !== 'undefined') updates[field] = req.body[field];
    });

    if (req.file && req.file.buffer) {
      const uploadsDir = path.join(__dirname, '..', 'uploads', 'avatars');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const ext = path.extname(req.file.originalname) || '.jpg';
      const filename = `${req.params.id}-${Date.now()}${ext}`;
      const outPath = path.join(uploadsDir, filename);

      if (sharp) {
        await sharp(req.file.buffer).resize(256, 256).jpeg({ quality: 80 }).toFile(outPath);
      } else {
        fs.writeFileSync(outPath, req.file.buffer);
      }

      updates.avatar = `/uploads/avatars/${filename}`;
    }

    const user = await User.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.followers.some((id) => id.toString() === currentUserId)) {
      return res.status(400).json({ message: 'You are already following this user.' });
    }

    await User.findByIdAndUpdate(targetUserId, { $push: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $push: { following: targetUserId } });

    res.status(200).json({ message: 'Successfully followed the user.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });

    res.status(200).json({ message: 'Successfully unfollowed the user.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};