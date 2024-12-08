const express = require('express');
const carController = require('../controllers/carController');
const { validateCar, validateCarId } = require('../validators/carDTO');
const authenticateToken = require('../authMiddleware');

const router = express.Router();

/**
 * @description Search cars by model or brand
 * @route GET /cars/search
 * @query {string} query - The search query to search by.
 * @access Public
 */
router.get('/search', (req, res) => carController.searchCars(req, res));

/**
 * @description Retrieve all cars.
 * @route GET /cars
 * @access Public
 */
router.get('/', (req, res) => carController.getAllCars(req, res));

/**
 * @description Retrieve a specific car by its `car_id`.
 * @route GET /cars/:car_id
 * @param {number} car_id - The ID of the car to retrieve.
 * @access Public
 */
router.get('/:car_id', [authenticateToken ,validateCarId], (req, res) => carController.getCarById(req, res));

/**
 * @description Add a new car to the inventory.
 * @route POST /cars
 * @body {string} model - The model of the car.
 * @body {string} brand - The brand of the car.
 * @body {number} top_speed - The top speed of the car.
 * @body {number} horsepower - The horsepower of the car.
 * @body {string} price - The price of the car.
 * @access Public
 */
router.post('/', validateCar, (req, res) => carController.createCar(req, res));

/**
 * @description Update a specific car by its `car_id`.
 * @route PUT /cars/:car_id
 * @param {number} car_id - The ID of the car to update.
 * @body {string} model - The new model of the car.
 * @body {string} brand - The new brand of the car.
 * @body {number} top_speed - The new top speed of the car.
 * @body {number} horsepower - The new horsepower of the car.
 * @body {string} price - The new price of the car.
 * @access Public
 */
router.post('/update-car/:car_id', [validateCarId, validateCar], (req, res) => carController.updateCar(req, res));

/**
 * @description Delete a specific car by its `car_id`.
 * @route DELETE /cars/:car_id
 * @param {number} car_id - The ID of the car to delete.
 * @access Public
 */
router.delete('/:car_id', validateCarId, (req, res) => carController.deleteCar(req, res));

/**
 * @description Render the edit form for a specific car by its `car_id`.
 * @route GET /cars/edit-form/:car_id
 * @param {number} car_id - The ID of the car to edit.
 * @access Public
 */
router.get('/edit-form/:car_id', validateCarId, (req, res) => carController.editForm(req, res));

module.exports = router;
