const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes by verifying the JSON Web Token (JWT).
 */
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user as an object with _id property
            req.user = { _id: decoded.id, id: decoded.id };

            next();
        } catch (error) {
            console.error("Token Verification Error:", error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };