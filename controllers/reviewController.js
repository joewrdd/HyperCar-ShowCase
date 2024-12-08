const reviewService = require('../services/reviewService');


/**
 * Controller class for handling review-related API requests.
 * Manages HTTP request handling for review operations such as retrieving,
 * creating, updating, and deleting reviews.
 */
class ReviewController {

    /**
     * Handles the request to retrieve all reviews.
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllReviews(req, res) {
        try {
            const reviews = await reviewService.getAllReviews();
            res.json(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to retrieve a review by ID.
     * @async
     * @param {Object} req - Express request object containing `review_id` in params.
     * @param {Object} res - Express response object.
     */
    async getReviewById(req, res) {
        try {
            const id = parseInt(req.params.car_id, 10);
            const review = await reviewService.getReviewById(id);
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }
            res.json(review);
        } catch (error) {
            console.error('Error fetching review:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getReviewByCarId(req, res) {
        try {
            const carId = parseInt(req.params.car_id, 10);
            if (isNaN(carId)) {
                return res.status(400).json({ message: 'Invalid car ID' });
            }
    
            const reviews = await reviewService.getReviewByCarId(carId);
            if (!reviews || reviews.length === 0) {
                return res.status(404).json({ message: 'No reviews found for this car' });
            }
    
            res.json(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to create a new review.
     * @async
     * @param {Object} req - Express request object containing `user_id`, `car_id`, `rating`, and `comment` in the body.
     * @param {Object} res - Express response object.
     */
    async createReview(req, res) {
        try {
            const { user_id, car_id, rating, comment } = req.body;
            if (!user_id || !car_id || !rating || !comment) {
                return res.status(400).json({ message: 'User ID, Car ID, rating, and comment are required' });
            }
            const newReview = await reviewService.createReview({ user_id, car_id, rating, comment });
            res.redirect('./dashboard');
            // res.status(201).json(newReview);
        } catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to update an existing review by ID.
     * @async
     * @param {Object} req - Express request object containing `review_id` in params and `user_id`,
     * `car_id`, `rating`, and `comment` in the body.
     * @param {Object} res - Express response object.
     */
    async updateReview(req, res) {
        try {
            const id = parseInt(req.params.review_id, 10);
            const { user_id, car_id, rating, comment } = req.body;
            const isAuthenticated = req.user ? true : false;
            /*if (!user_id || !car_id || !rating || !comment) {
                return res.status(400).json({ message: 'User ID, Car ID, rating, and comment are required' });
            } */
            const success = await reviewService.updateReview(id, { user_id, car_id, rating, comment });
            /* if (!success) {
                return res.status(404).json({ message: 'Review not found or changes not made' });
            }
            res.json({ message: 'Review updated successfully!!' }); */
            res.redirect('/admin');
        } catch (error) {
            console.error('Error updating review:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to delete a review by ID.
     * @async
     * @param {Object} req - Express request object containing `review_id` in params.
     * @param {Object} res - Express response object.
     */
    async deleteReview(req, res) {
        try {
            const id = parseInt(req.params.review_id, 10);
            const success = await reviewService.deleteReview(id);
            if (!success) {
                return res.status(404).json({ message: 'Review not found' });
            }
            res.redirect('/admin');
            // res.json({ message: 'Review deleted successfully!!' });
        } catch (error) {
            console.error('Error deleting review:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to edit reviews from the admin portal.
     */
    async editForm(req, res) {
        try {
          const id = parseInt(req.params.review_id, 10);
          const review = await reviewService.getReviewById(id);
          res.render('editreviews', {review: review});
        } catch (error) {
          console.error('Error updating review:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ReviewController();
