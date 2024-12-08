const express = require('express');
const reviewController = require('../controllers/reviewController');
const { validateReview, validateReviewId, validateCarId } = require('../validators/reviewDTO');

const router = express.Router();

/**
 * @description Retrieve all reviews from the database.
 * @route GET /reviews
 * @access Public
 */
router.get('/', (req, res) => reviewController.getAllReviews(req, res));

/**
 * @description Retrieve a specific review by its `review_id`.
 * @route GET /reviews/:review_id
 * @param {number} review_id - The ID of the review to retrieve.
 * @access Public
 */
router.get('/:review_id', validateReviewId, (req, res) => reviewController.getReviewById(req, res));

    /**
 * @description Retrieve all reviews for a specific car by its `car_id`.
 * @route GET /reviews/car/:car_id
 * @param {number} car_id - The ID of the car whose reviews are to be retrieved.
 * @access Public
 */
router.get('/car/:car_id', validateCarId, (req, res) => reviewController.getReviewByCarId(req, res));

/**
 * @description Create a new review.
 * @route POST /reviews
 * @body {number} user_id - The ID of the user who wrote the review.
 * @body {number} car_id - The ID of the car being reviewed.
 * @body {number} rating - The rating given to the car (integer between 1 and 5).
 * @body {string} [comment] - Optional comment about the car.
 * @body {string} date_posted - The date when the review was posted.
 * @access Public
 */
router.post('/', validateReview, (req, res) => reviewController.createReview(req, res));

/**
 * @description Update an existing review by its `review_id`.
 * @route PUT /reviews/:review_id
 * @param {number} review_id - The ID of the review to update.
 * @body {number} [user_id] - The updated user ID for the review.
 * @body {number} [car_id] - The updated car ID for the review.
 * @body {number} [rating] - The updated rating for the review.
 * @body {string} [comment] - The updated comment for the review.
 * @body {string} [date_posted] - The updated date when the review was posted.
 * @access Public
 */
router.post('/update-review/:review_id', [validateReviewId, validateReview], (req, res) => reviewController.updateReview(req, res));

/**
 * @description Delete a review by its `review_id`.
 * @route DELETE /reviews/:review_id
 * @param {number} review_id - The ID of the review to delete.
 * @access Public
 */
router.delete('/:review_id', validateReviewId, (req, res) => reviewController.deleteReview(req, res));

/**
 * @description Render the edit form for a specific review by its `review_id`.
 * @route GET /reviews/edit-form/:review_id
 * @param {number} review_id - The ID of the review to edit.
 * @access Public
 */
router.get('/edit-form/:review_id', validateReviewId, (req, res) => reviewController.editForm(req, res));

module.exports = router;
