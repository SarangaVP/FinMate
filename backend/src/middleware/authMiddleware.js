const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes by verifying the JSON Web Token (JWT).
 * It extracts the token from the Authorization header and verifies it 
 * using the secret key defined in the environment variables.
 */
const protect = (req, res, next) => {
    let token;

    // Check for token in the Authorization header (Expected format: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (split "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key from .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the decoded User ID to the request object
            // This allows subsequent controllers (like Transaction) to know which user is active
            req.user = decoded.id;

            next(); // Move to the next function in the route
        } catch (error) {
            console.error("Token Verification Error:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is found in the header
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };