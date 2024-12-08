const express = require('express');
const manufacturerController = require('../controllers/manufacturerController');
const { validateManufacturer, validateManufacturerId } = require('../validators/manufacturerDTO');

const router = express.Router();

/**
 * @description Retrieve all manufacturers.
 * @route GET /manufacturers
 * @access Public
 */
router.get('/', (req, res) => manufacturerController.getAllManufacturers(req, res));

/**
 * @description Retrieve a specific manufacturer by its `manufacturer_id`.
 * @route GET /manufacturers/:manufacturer_id
 * @param {number} manufacturer_id - The ID of the manufacturer to retrieve.
 * @access Public
 */
router.get('/:manufacturer_id', validateManufacturerId, (req, res) => manufacturerController.getManufacturerById(req, res));

/**
 * @description Create a new manufacturer.
 * @route POST /manufacturers
 * @body {string} name - The name of the manufacturer.
 * @body {string} country - The country where the manufacturer is based.
 * @body {number} founded_year - The year the manufacturer was founded.
 * @access Public
 */
router.post('/', validateManufacturer, (req, res) => manufacturerController.createManufacturer(req, res));

/**
 * @description Update a specific manufacturer by its `manufacturer_id`.
 * @route PUT /manufacturers/:manufacturer_id
 * @param {number} manufacturer_id - The ID of the manufacturer to update.
 * @body {string} name - The name of the manufacturer.
 * @body {string} country - The country where the manufacturer is based.
 * @body {number} founded_year - The year the manufacturer was founded.
 * @access Public
 */
router.post('/update-manufacturer/:manufacturer_id', [validateManufacturerId, validateManufacturer],
      (req, res) => manufacturerController.updateManufacturer(req, res));

/**
 * @description Delete a specific manufacturer by its `manufacturer_id`.
 * @route DELETE /manufacturers/:manufacturer_id
 * @param {number} manufacturer_id - The ID of the manufacturer to delete.
 * @access Public
 */
router.delete('/:manufacturer_id', validateManufacturerId, (req, res) => manufacturerController.deleteManufacturer(req, res));

/**
 * @description Render the edit form for a specific manufacturer by its `manufacturer_id`.
 * @route GET /manufacturers/edit-form/:manufacturer_id
 * @param {number} manufacturer_id - The ID of the manufacturer to edit.
 * @access Public
 */
router.get('/edit-form/:manufacturer_id', validateManufacturerId, (req, res) => manufacturerController.editForm(req, res));


module.exports = router;
