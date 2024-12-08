const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to validate the creation or update of a review.
 * This middleware ensures that the review data in the request body is in the correct format.
 * 
 * Expected Input:
 * - `user_id`: a valid integer representing the user ID
 * - `car_id`: a valid integer representing the car ID
 * - `rating`: an integer between 1 and 5, representing the rating given by the user
 * - `comment`: an optional string containing the user's comment
 * - `date_posted`: a valid ISO 8601 date representing when the review was posted
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: { "user_id": 1, "car_id": 2, "rating": 5, "comment": "Wow what a car!", "date_posted": "2024-11-01" }
 * - Response (if invalid): 400 Bad Request with validation error messages
 */
const validateReview = [
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

    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5')
        .notEmpty()
        .withMessage('Rating is required'),

    body('comment')
        .isString()
        .withMessage('Comment must be a string')
        .optional(), 

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/**
 * Middleware to validate the `review_id` parameter in route paths.
 * This ensures that the `review_id` in the URL is a valid integer.
 * 
 * Expected Input:
 * - `review_id`: a valid integer representing the review ID in the route parameters
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: /reviews/1 (valid)
 * - Response (if invalid): 400 Bad Request with validation error messages (e.g., "Review ID must be an integer")
 */
const validateReviewId = [
    param('review_id')
        .isInt()
        .withMessage('Review ID must be an integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateCarId = [
    param('car_id')
        .isInt()
        .withMessage('Car ID must be an integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateReview, validateReviewId, validateCarId };
