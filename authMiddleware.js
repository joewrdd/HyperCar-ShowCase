/**
 * @description Middleware to authenticate a user based on a token in cookies.
 * This middleware checks if the token exists and is valid. If the token is valid,
 * it attaches the user information to the request object and allows the request to proceed.
 * If the token is missing or invalid, it redirects to the login page or returns a 403 error.
 * @route Middleware (used in protected routes)
 * @access Protected (requires a valid token)
 * @param {object} req - The request object, which will contain user data if authenticated.
 * @param {object} res - The response object.
 * @param {function} next - The function that passes control to the next middleware or route handler.
 * @throws {403} If the token is invalid or expired.
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Get token from cookies
    res.cookie('token', token, { httpOnly: true });

    console.log("token", token)
    if (!token ) {
        console.log("No token found, redirecting to login.");
        res.redirect('login');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err.message);
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }

        req.user = user; // Attach user information to the request object
        req.isAuthenticated = true; // Mark the request as authenticated
        next(); // Pass control to the next middleware or route handler
    });
}

module.exports = authenticateToken;

