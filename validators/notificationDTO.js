const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to validate the creation of a notification.
 * This middleware ensures that the notification data in the request body is in the correct format.
 * 
 * Expected Input:
 * - `user_id`: a valid integer representing the user ID who will receive the notification
 * - `title`: a valid string representing the title of the notification
 * - `message`: a valid string representing the content of the notification
 * - `type`: a valid string representing the type of notification 
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: { "user_id": 1, "title": "New Model Launch", "message": "You have a new message!", "type": "Event" }
 * - Response (if invalid): 400 Bad Request with validation error messages
 */
const validateNotification = [
    body('user_id')
        .isInt()
        .withMessage('User ID must be an integer')
        .notEmpty()
        .withMessage('User ID is required'),

    body('title')
        .isString()
        .withMessage('Title must be a string')
        .notEmpty()
        .withMessage('Title is required'),

    body('message')
        .isString()
        .withMessage('Message must be a string')
        .notEmpty()
        .withMessage('Message is required'),

    body('type')
        .isString()
        .withMessage('Type must be a string')
        .notEmpty()
        .withMessage('Type is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/**
 * Middleware to validate the `notification_id` parameter in route paths.
 * This ensures that the `notification_id` in the URL is a valid integer.
 * 
 * Expected Input:
 * - `notification_id`: a valid integer representing the notification ID in the route parameters
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: /notifications/1 (valid)
 * - Response (if invalid): 400 Bad Request with validation error messages (e.g., "Notification ID must be an integer")
 */
const validateNotificationId = [
    param('notification_id')
        .isInt()
        .withMessage('Notification ID must be an integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateNotification, validateNotificationId };
