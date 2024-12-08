const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to validate the creation of a car entry.
 * This middleware ensures that the car data in the request body is in the correct format.
 * 
 * Expected Input:
 * - `model`: a valid string representing the model of the car
 * - `brand`: a valid string representing the brand of the car
 * - `top_speed`: a valid float number greater than 0 representing the car's top speed
 * - `horsepower`: a valid integer greater than 0 representing the car's horsepower
 * - `price`: a valid string representing the car's price 
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: { "model": "370z Nismo", "brand": "Nissan", "top_speed": 250, "horsepower": 350, "price": "$48,500" }
 * - Response (if invalid): 400 Bad Request with validation error messages
 */
const validateCar = [
    body('model')
        .isString()
        .withMessage('Model must be a string')
        .notEmpty()
        .withMessage('Model is required'),

    body('brand')
        .isString()
        .withMessage('Brand must be a string')
        .notEmpty()
        .withMessage('Brand is required'),

    body('top_speed')
        .isFloat({ gt: 0 })
        .withMessage('Top speed must be a positive number'),

    body('horsepower')
        .isInt({ gt: 0 })
        .withMessage('Horsepower must be a positive integer'),

    body('price')
        .isString()
        .withMessage('Price must be a string')
        .notEmpty()
        .withMessage('Price is required'),

    body('images')
        .isString()
        .withMessage('Image must be a string')
        .notEmpty()
        .withMessage('Image is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


/**
 * Middleware to validate the `car_id` parameter in route paths.
 * This ensures that the `car_id` in the URL is a valid integer.
 * 
 * Expected Input:
 * - `car_id`: a valid integer representing the car ID in the route parameters
 * 
 * If validation fails, a 400 response with error details will be returned.
 * 
 * Example:
 * - Input: /cars/1 (valid)
 * - Response (if invalid): 400 Bad Request with validation error messages (e.g., "Car ID must be an integer")
 */
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

module.exports = { validateCar, validateCarId };
