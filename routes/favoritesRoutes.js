const express = require('express');
const favoritesController = require('../controllers/favoritesController');
const { validateFavorites, validateFavoritesId } = require('../validators/favoritesDTO');
const { validateUserId } = require('../validators/userDTO');

const router = express.Router();

/**
 * @description Retrieve all favorite cars.
 * @route GET /favorites
 * @access Public
 */
router.get('/', (req, res) => favoritesController.getAllFavorites(req, res));

/**
 * @description Retrieve a specific favorite by its `favorites_id`.
 * @route GET /favorites/:favorites_id
 * @param {number} favorites_id - The ID of the favorite record to retrieve.
 * @access Public
 */
router.get('/:favorites_id', validateFavoritesId, (req, res) => favoritesController.getFavoritesById(req, res));

/**
 * @description Retrieve all favorite cars for a specific user.
 * @route GET /favorites/user/:user_id
 * @param {number} user_id - The ID of the user whose favorites are to be retrieved.
 * @access Public
 */
router.get('/user/:user_id', validateUserId, (req, res) => favoritesController.getFavoritesByUser(req, res));

/**
 * @description Add a car to a user's favorites.
 * @route POST /favorites
 * @body {number} user_id - The ID of the user adding the car to their favorites.
 * @body {number} car_id - The ID of the car being added to favorites.
 * @access Public
 */
router.post('/', validateFavorites, (req, res) => favoritesController.createFavorites(req, res));

/**
 * @description Update a specific favorite by its `favorites_id`.
 * @route PUT /favorites/:favorites_id
 * @param {number} favorites_id - The ID of the favorite to update.
 * @body {number} user_id - The ID of the user updating the favorite.
 * @body {number} car_id - The ID of the car being updated in the favorites.
 * @access Public
 */
router.post('/update-favorites/:favorites_id', [validateFavoritesId, validateFavorites], 
    (req, res) => favoritesController.updateFavorites(req, res));

/**
 * @description Delete a specific favorite by its `favorites_id`.
 * @route DELETE /favorites/:favorites_id
 * @param {number} favorites_id - The ID of the favorite to delete.
 * @access Public
 */
router.delete('/:favorites_id', validateFavoritesId, (req, res) => favoritesController.deleteFavorite(req, res));

/**
 * @description Render the edit form for a specific favorite by its `favorites_id`.
 * @route GET /favorites/edit-form/:favorites_id
 * @param {number} favorites_id - The ID of the favorite to edit.
 * @access Public
 */
router.get('/edit-form/:favorites_id', validateFavoritesId, (req, res) => favoritesController.editForm(req, res));

module.exports = router;
