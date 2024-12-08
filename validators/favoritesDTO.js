const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to validate the creation of a favorite entry.
 * This middleware ensures that the favorite data in the request body is in the correct format.
 * 
 * Expected Input:
 * - `user_id`: a valid integer representing the user ID
 * - `car_id`: a valid integer representing the car ID
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: { "user_id": 1, "car_id": 10 }
 * - Response (if invalid): 400 Bad Request with validation error messages
 */
const validateFavorites = [
    body('user_id')
        .isInt()
        .withMessage('User ID must be an integer')
        .notEmpty()
        .withMessage('User ID is required'),

    body('car_id')
        .isInt()
        .withMessage('Car ID must be an integer')
        .notEmpty()
        .withMessage('Car ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/**
 * Middleware to validate the `favorites_id` parameter in route paths.
 * This ensures that the `favorites_id` in the URL is a valid integer.
 * 
 * Expected Input:
 * - `favorites_id`: a valid integer representing the favorite entry ID in the route parameters
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: /favorites/1 (valid)
 * - Response (if invalid): 400 Bad Request with validation error messages (e.g., "Favorites ID must be an integer")
 */
const validateFavoritesId = [
    param('favorites_id')
        .isInt()
        .withMessage('Favorites ID must be an integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateFavorites, validateFavoritesId };
