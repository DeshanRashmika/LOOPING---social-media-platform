const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { register, login, refreshToken, logout } = require('../controllers/authController');

router.post('/register', [
	body('username').isLength({ min: 3 }).withMessage('username must be at least 3 chars'),
	body('email').isEmail().withMessage('invalid email'),
	body('password').isLength({ min: 6 }).withMessage('password must be at least 6 chars')
], validate, register);

router.post('/login', [
	body('email').isEmail().withMessage('invalid email'),
	body('password').notEmpty().withMessage('password required')
], validate, login);

router.post('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;