const favoriteService = require('../services/favoritesService');

/**
 * Controller class for handling favorite-related API requests.
 * Manages HTTP request handling for operations such as retrieving,
 * creating, updating, and deleting user favorites.
 */
class FavoriteController {

    /**
     * Handles the request to retrieve all favorites.
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllFavorites(req, res) {
        try {
            const favorites = await favoriteService.getAllFavorites();
            res.json(favorites);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to retrieve a favorite by its ID.
     * @async
     * @param {Object} req - Express request object containing `favorite_id` in params.
     * @param {Object} res - Express response object.
     */
    async getFavoriteById(req, res) {
        try {
            const id = parseInt(req.params.favorites_id, 10);
            const favorite = await favoriteService.getFavoriteById(id);
            if (!favorite) {
                return res.status(404).json({ message: 'Favorite not found' });
            }
            res.json(favorite);
        } catch (error) {
            console.error('Error fetching favorite:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to retrieve all favorite cars for a specific user.
     * @async
     * @param {Object} req - Express request object containing `user_id` in params.
     * @param {Object} res - Express response object.
     */
    async getFavoritesByUser(req, res) {
        try {
            const userId = parseInt(req.params.user_id, 10);
            const userFavorites = await favoriteService.getFavoritesByUser(userId);
        
            if (!userFavorites || userFavorites.length === 0) {
                return res.status(404).json({ message: 'No favorites found for this user' });
            }
            res.json(userFavorites);
        } catch (error) {
            console.error('Error fetching user favorites:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to create a new favorite.
     * @async
     * @param {Object} req - Express request object containing `user_id` and `car_id` in the body.
     * @param {Object} res - Express response object.
     */
    async createFavorites(req, res) {
        try {
            const { user_id, car_id } = req.body;
    
            if (!user_id || !car_id) {
                return res.status(400).json({ message: 'User ID and Car ID are required' });
            }
    
            // Check if the favorite already exists
            const existingFavorite = await favoriteService.getFavoriteByUserAndCar(user_id, car_id);
            if (existingFavorite) {
                return res.status(400).json({ message: 'This car is already in your favorites' });
            }
    
            // If not, create the new favorite
            const newFavorite = await favoriteService.createFavorites({ user_id, car_id });
            return res.status(201).json(newFavorite);
        } catch (error) {
            console.error('Error creating favorite:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    

    /**
     * Handles the request to update an existing favorite.
     * @async
     * @param {Object} req - Express request object containing `favorite_id` in params and `user_id`, `car_id` in the body.
     * @param {Object} res - Express response object.
     */
    async updateFavorites(req, res) {
        try {
            const id = parseInt(req.params.favorites_id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid favorite ID'});
            }
            const { user_id, car_id } = req.body;
            const success = await favoriteService.updateFavorites(id, { user_id, car_id });
            res.redirect('/admin');
        } catch (error) {
            console.error('Error updating favorite:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to delete a favorite by its ID.
     * @async
     * @param {Object} req - Express request object containing `favorite_id` in params.
     * @param {Object} res - Express response object.
     */
    async deleteFavorite(req, res) {
        try {
            const id = parseInt(req.params.favorites_id, 10);
            const success = await favoriteService.deleteFavorite(id);
            if (!success) {
                return res.status(404).json({ message: 'Favorite not found' });
            }
            res.redirect('/userfavorites');
        } catch (error) {
            console.error('Error deleting favorite:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request to edit favorites from the admin portal.
     */
    async editForm(req, res) {
        try {
          const id = parseInt(req.params.favorites_id, 10);
          const favorites = await favoriteService.getFavoriteById(id);
          res.render('editfavorites', {favorites: favorites});
        } catch (error) {
          console.error('Error updating favorite:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
}

module.exports = new FavoriteController();
