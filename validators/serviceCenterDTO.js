const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to validate the creation or update of a service center.
 * This middleware ensures that the service center data in the request body is in the correct format.
 * 
 * Expected Input:
 * - `name`: a non-empty string representing the service center's name
 * - `location`: a non-empty string representing the service center's location
 * - `contact_nb`: a string representing the contact number (must be between 10 and 15 characters)
 * - `manufacturer_id`: a valid integer representing the manufacturer ID
 * - `services_offered`: a non-empty string describing the services offered by the service center
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: { "name": "Big Joe's AutoMobile TuneShop", "location": "Beirut", "contact_nb": "76000623", 
 * "manufacturer_id": 1, "services_offered": "Oil Change, Tire Replacement, Car Tuning" }
 * - Response (if invalid): 400 Bad Request with validation error messages
 */
const validateServiceCenter = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .notEmpty()
        .withMessage('Name is required'),

    body('location')
        .isString()
        .withMessage('Location must be a string')
        .notEmpty()
        .withMessage('Location is required'),

    body('contact_nb')
        .isString()
        .withMessage('Contact number must be a string')
        .notEmpty()
        .withMessage('Contact number is required')
        .isLength({ min: 10, max: 15 })
        .withMessage('Contact number must be between 10 and 15 characters'),

    body('manufacturer_id')
        .isInt()
        .withMessage('Manufacturer ID must be an integer')
        .notEmpty()
        .withMessage('Manufacturer ID is required'),

    body('services_offered')
        .isString()
        .withMessage('Services offered must be a string')
        .notEmpty()
        .withMessage('Services offered are required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/**
 * Middleware to validate the `service_cent_id` parameter in route paths.
 * This ensures that the `service_cent_id` in the URL is a valid integer.
 * 
 * Expected Input:
 * - `service_cent_id`: a valid integer representing the service center ID in the route parameters
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: /service-centers/1 (valid)
 * - Response (if invalid): 400 Bad Request with validation error messages (e.g., "Service Center ID must be an integer")
 */
const validateServiceCenterId = [
    param('service_cent_id')
        .isInt()
        .withMessage('Service Center ID must be an integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateServiceCenter, validateServiceCenterId };
