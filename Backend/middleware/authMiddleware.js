const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "please login first" });
    }

    try {
        const actualToken = token.split(" ")[1] ? token.split(" ")[1] : token;

        const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};