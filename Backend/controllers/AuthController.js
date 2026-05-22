const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function hashToken(token) {
	return crypto.createHash('sha256').update(token).digest('hex');
}

function signAccessToken(userId) {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

function createRefreshToken() {
	return crypto.randomBytes(64).toString('hex');
}

function setRefreshCookie(res, token) {
	res.cookie('refreshToken', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.COOKIE_SAMESITE || 'Lax',
		maxAge: REFRESH_TOKEN_TTL_MS
	});
}

function clearRefreshCookie(res) {
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.COOKIE_SAMESITE || 'Lax'
	});
}

function safeUser(user) {
	return {
		id: user._id,
		username: user.username,
		email: user.email,
		avatar: user.avatar || '',
		bio: user.bio || '',
		isPrivate: !!user.isPrivate,
		showEmail: !!user.showEmail
	};
}

exports.register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return res.status(400).json({ message: 'This email address is already in use.' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			username: username.trim(),
			email: email.toLowerCase().trim(),
			password: hashedPassword
		});

		return res.status(201).json({
			message: 'Account created successfully.',
			user: safeUser(user)
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email: email.toLowerCase().trim() });
		if (!user) {
			return res.status(404).json({ message: 'Account not found.' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid password.' });
		}

		const accessToken = signAccessToken(user._id);
		const refreshToken = createRefreshToken();
		const refreshTokenHash = hashToken(refreshToken);

		user.refreshTokens.push({ token: refreshTokenHash });
		await user.save();

		setRefreshCookie(res, refreshToken);

		return res.status(200).json({
			message: 'Logged in successfully.',
			accessToken,
			user: safeUser(user)
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies?.refreshToken;
		if (!refreshToken) {
			return res.status(401).json({ message: 'No refresh token provided.' });
		}

		const refreshTokenHash = hashToken(refreshToken);
		const user = await User.findOne({ 'refreshTokens.token': refreshTokenHash });

		if (!user) {
			clearRefreshCookie(res);
			return res.status(401).json({ message: 'Invalid refresh token.' });
		}

		user.refreshTokens = user.refreshTokens.filter((item) => item.token !== refreshTokenHash);

		const nextRefreshToken = createRefreshToken();
		user.refreshTokens.push({ token: hashToken(nextRefreshToken) });
		await user.save();

		setRefreshCookie(res, nextRefreshToken);

		return res.json({
			accessToken: signAccessToken(user._id)
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.logout = async (req, res) => {
	try {
		const refreshToken = req.cookies?.refreshToken;

		if (refreshToken) {
			const refreshTokenHash = hashToken(refreshToken);
			const user = await User.findOne({ 'refreshTokens.token': refreshTokenHash });

			if (user) {
				user.refreshTokens = user.refreshTokens.filter((item) => item.token !== refreshTokenHash);
				await user.save();
			}
		}

		clearRefreshCookie(res);
		return res.json({ message: 'Logged out successfully.' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Server error' });
	}
};

