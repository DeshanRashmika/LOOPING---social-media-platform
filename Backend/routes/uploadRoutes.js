const express = require('express');
const router = express.Router();
const multer = require('multer');
const protect = require('../middleware/authMiddleware');
const { uploadImage, presignUpload } = require('../controllers/uploadController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const storage = multer.memoryStorage();
const upload = multer({
    
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'), false);
    cb(null, true);
  }
});

router.post('/', protect, upload.single('file'), uploadImage);

router.post('/presign', protect, [
  body('filename').notEmpty().withMessage('filename required'),
  body('contentType').notEmpty().withMessage('contentType required').bail().custom((v) => v.startsWith('image/'))
], validate, presignUpload);

module.exports = router;
