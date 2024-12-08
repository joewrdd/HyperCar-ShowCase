const { initDB } = require('../config/database.js');
const Review = require('../models/reviewModel.js');

/**
 * Service class for managing review-related database operations.
 * Handles CRUD operations for the `reviews` table.
 */
class ReviewService {
    /**
     * Initializes the ReviewService instance and database connection pool.
     */
    constructor() {
        this.pool = null;
        this.init();
    }

    /**
     * Initializes the database connection pool.
     * @async
     */
    async init() {
        this.pool = await initDB();
    }

    /**
     * Retrieves all reviews from the database.
     * @async
     * @returns {Promise<Array<Review>>} - Array of Review objects representing all reviews in the database.
     */
    async getAllReviews() {
        const [rows] = await this.pool.query('SELECT * FROM reviews');
        return rows.map(Review.fromRow);
    }

    /**
     * Retrieves a review by its ID.
     * @async
     * @param {number} id - The ID of the review to retrieve.
     * @returns {Promise<Review|null>} - Review object if found, or null if no review with the specified ID exists.
     */
    async getReviewById(id) {
        const [rows] = await this.pool.query('SELECT * FROM reviews WHERE review_id = ?', [id]);
        if (rows.length === 0) return null;
        return Review.fromRow(rows[0]);
    }

    async getReviewByCarId(carId) {
        const [rows] = await this.pool.query('SELECT * FROM reviews WHERE car_id = ?', [carId]);
        if (rows.length === 0) return null;
        return rows.map(row => Review.fromRow(row));
    }

    /**
     * Creates a new review in the database.
     * @async
     * @param {Object} reviewData - Data for the new review, containing `user_id`, `car_id`, `rating`, and `comment`.
     * @param {number} reviewData.user_id - The ID of the user who wrote the review.
     * @param {number} reviewData.car_id - The ID of the car being reviewed.
     * @param {number} reviewData.rating - The rating given in the review.
     * @param {string} reviewData.comment - The comment content of the review.
     * @returns {Promise<Object>} - Object with `review_id`, `user_id`, `car_id`, `rating`,
     * `comment`, and `date_posted` of the newly created review.
     */
    async createReview(reviewData) {
        const { user_id, car_id, rating, comment } = reviewData;
        const [result] = await this.pool.query(
            'INSERT INTO reviews (user_id, car_id, rating, comment, date_posted) VALUES (?, ?, ?, ?, NOW())',
            [user_id, car_id, rating, comment]
        );
        return { review_id: result.insertId, user_id, car_id, rating, comment, date_posted: new Date() };
    }

    /**
     * Updates an existing review's data.
     * @async
     * @param {number} id - The ID of the review to update.
     * @param {Object} reviewData - New data for the review, containing `user_id`, `car_id`, `rating`, and `comment`.
     * @param {number} reviewData.user_id - The ID of the user who wrote the review.
     * @param {number} reviewData.car_id - The ID of the car being reviewed.
     * @param {number} reviewData.rating - The updated rating in the review.
     * @param {string} reviewData.comment - The updated comment content of the review.
     * @returns {Promise<boolean>} - `true` if the review was updated, `false` otherwise.
     */
    async updateReview(id, reviewData) {
        const { user_id, car_id, rating, comment } = reviewData;
        const [result] = await this.pool.query(
            'UPDATE reviews SET user_id = ?, car_id = ?, rating = ?, comment = ? WHERE review_id = ?',
            [user_id, car_id, rating, comment, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Deletes a review from the database by its ID.
     * @async
     * @param {number} id - The ID of the review to delete.
     * @returns {Promise<boolean>} - `true` if the review was deleted, `false` otherwise.
     */
    async deleteReview(id) {
        const [result] = await this.pool.query('DELETE FROM reviews WHERE review_id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new ReviewService();
