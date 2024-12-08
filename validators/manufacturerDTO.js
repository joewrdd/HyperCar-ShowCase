const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to validate the creation of a manufacturer.
 * This middleware ensures that the manufacturer data in the request body is in the correct format.
 * 
 * Expected Input:
 * - `name`: a valid string representing the manufacturer's name
 * - `country`: a valid string representing the country where the manufacturer is located
 * - `founded_year`: a valid integer representing the year the manufacturer was founded (between 1000 and the current year)
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: { "name": "Mitsubishi", "country": "Japan", "founded_year": 1870 }
 * - Response (if invalid): 400 Bad Request with validation error messages
 */
const validateManufacturer = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .notEmpty()
        .withMessage('Name is required'),

    body('country')
        .isString()
        .withMessage('Country must be a string')
        .notEmpty()
        .withMessage('Country is required'),

    body('founded_year')
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage('Founded year must be a valid year')
        .notEmpty()
        .withMessage('Founded year is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/**
 * Middleware to validate the `manufacturer_id` parameter in route paths.
 * This ensures that the `manufacturer_id` in the URL is a valid integer.
 * 
 * Expected Input:
 * - `manufacturer_id`: a valid integer representing the manufacturer ID in the route parameters
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: /manufacturers/1 (valid)
 * - Response (if invalid): 400 Bad Request with validation error messages (e.g., "Manufacturer ID must be an integer")
 */
const validateManufacturerId = [
    param('manufacturer_id')
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

module.exports = { validateManufacturer, validateManufacturerId };
