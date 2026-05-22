const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getUser, updateUser } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed'), false);
        cb(null, true);
    }
});

const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/:id', getUser);
router.put('/:id', protect, upload.single('avatar'), [
  body('username').optional().isLength({ min: 3 }).withMessage('username must be at least 3 chars'),
  body('email').optional().isEmail().withMessage('invalid email'),
  body('isPrivate').optional().isBoolean().withMessage('isPrivate must be boolean'),
  body('showEmail').optional().isBoolean().withMessage('showEmail must be boolean')
], validate, updateUser);

module.exports = router;
