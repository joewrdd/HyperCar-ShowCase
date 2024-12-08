/**
 * Review model representing a review entity in the system.
 * This model is used to define the structure of a review and 
 * handle instantiation and conversion of data from database rows.
 */
class Review {
    /**
     * Creates an instance of the Review class.
     * @constructor
     * @param {number} review_id - The unique identifier for the review.
     * @param {number} user_id - The ID of the user who wrote the review.
     * @param {number} car_id - The ID of the car being reviewed.
     * @param {number} rating - The rating given by the user (typically 1 to 5 stars).
     * @param {string} comment - The textual comment provided by the user in the review.
     * @param {string} date_posted - The date the review was posted.
     */
    constructor(review_id, user_id, car_id, rating, comment, date_posted) {
        this.review_id = review_id;
        this.user_id = user_id;
        this.car_id = car_id;
        this.rating = rating;
        this.comment = comment;
        this.date_posted = date_posted;
    }

    /**
     * Converts a database row into a Review instance.
     * @static
     * @param {Object} row - The database row representing a review.
     * @param {number} row.review_id - The unique identifier for the review.
     * @param {number} row.user_id - The ID of the user who wrote the review.
     * @param {number} row.car_id - The ID of the car being reviewed.
     * @param {number} row.rating - The rating given by the user (typically 1 to 5 stars).
     * @param {string} row.comment - The comment provided by the user in the review.
     * @param {string} row.date_posted - The date the review was posted.
     * @returns {Review} A new instance of the Review class.
     */
    static fromRow(row) {
        return new Review(
            row.review_id,
            row.user_id,
            row.car_id,
            row.rating,
            row.comment,
            row.date_posted
        );
    }
}

module.exports = Review;
