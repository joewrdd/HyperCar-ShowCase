const { body, param, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

/**
 * Middleware to validate user creation or update data.
 * This middleware ensures that the user data in the request body is in the correct format.
 * 
 * Expected Input:
 * - `name`: a non-empty string
 * - `email`: a valid email address
 * - `password`: a strong password (using password strength rules)
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: { "name": "Joe Ward", "email": "joewrdd@gmail.com", "password": "6Gxuwb99@$" }
 * - Response (if invalid): 400 Bad Request with validation error messages
 */
const validateUser = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .notEmpty()
        .withMessage('Name is required'),

    body('email')
        .isEmail()
        .withMessage('Email must be valid')
        .notEmpty()
        .withMessage('Email is required'),

    body('password')
        .isString()
        .withMessage('Choose a password')
        .notEmpty()
        .withMessage('Password is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/**
 * Middleware to validate the `user_id` parameter in route paths.
 * This ensures that the `user_id` in the URL is a valid integer.
 * 
 * Expected Input:
 * - `user_id`: a valid integer representing the user's ID in the route parameters
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: /users/1 (valid)
 * - Response (if invalid): 400 Bad Request with validation error messages (e.g., "ID must be an integer")
 */
const validateUserId = [
    param('user_id')
        .isInt()
        .withMessage('ID must be an integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


module.exports = {
    validateUser,
    validateUserId,
};
