const { initDB } = require('../config/database.js');
const Favorite = require('../models/favoritesModel.js');

/**
 * Service class for managing favorite-related database operations.
 * Handles CRUD operations for the `favorites` table.
 */
class FavoriteService {
    /**
     * Initializes the FavoriteService instance and database connection pool.
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
     * Retrieves all favorite records from the database.
     * @async
     * @returns {Promise<Array<Favorite>>} - Array of Favorite objects representing all favorites in the database.
     */
    async getAllFavorites() {
        const [rows] = await this.pool.query('SELECT * FROM favorites');
        return rows.map(Favorite.fromRow);
    }

    /**
     * Retrieves all favorite records for a specific user.
     * @async
     * @param {number} userId - The ID of the user whose favorites are to be retrieved.
     * @returns {Promise<Array<Favorite>>} - Array of Favorite objects representing all favorites for the user.
     */
    async getFavoritesByUser(userId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM favorites WHERE user_id = ?',
            [userId]
        );
        return rows.map(Favorite.fromRow);
    }

    /**
     * Retrieves a favorite record by its ID.
     * @async
     * @param {number} favorites_id - The ID of the favorite to retrieve.
     * @returns {Promise<Favorite|null>} - Favorite object if found, or null if no favorite with the specified ID exists.
     */
    async getFavoriteById(favorites_id) {
        const [rows] = await this.pool.query('SELECT * FROM favorites WHERE favorites_id = ?', [favorites_id]);
        if (rows.length === 0) return null;
        return Favorite.fromRow(rows[0]);
    }

    /**
     * Creates a new favorite record in the database.
     * @async
     * @param {Object} favoriteData - Data for the new favorite, containing `user_id` and `car_id`.
     * @param {number} favoriteData.user_id - The ID of the user adding the favorite.
     * @param {number} favoriteData.car_id - The ID of the car being added as a favorite.
     * @returns {Promise<Object>} - Object with `favorites_id`, `user_id`, and `car_id` of the newly created favorite.
     */
    async createFavorites(favoriteData) {
        const { user_id, car_id } = favoriteData;
        const [result] = await this.pool.query(
            'INSERT INTO favorites (user_id, car_id) VALUES (?, ?)',
            [user_id, car_id]
        );
        return { favorites_id: result.insertId, user_id, car_id };
    }

    /**
     * Updates an existing favorite record.
     * @async
     * @param {number} favorites_id - The ID of the favorite to update.
     * @param {Object} favoriteData - New data for the favorite, containing `user_id` and `car_id`.
     * @param {number} favoriteData.user_id - The updated ID of the user.
     * @param {number} favoriteData.car_id - The updated ID of the car.
     * @returns {Promise<boolean>} - `true` if the favorite was updated, `false` otherwise.
     */
    async updateFavorites(favorites_id, favoriteData) {
        const { user_id, car_id } = favoriteData;
        const [result] = await this.pool.query(
            'UPDATE favorites SET user_id = ?, car_id = ? WHERE favorites_id = ?',
            [user_id, car_id, favorites_id]
        );
        return result.affectedRows > 0;
    }

    async getFavoriteByUserAndCar(user_id, car_id) {
        try {
            return await Favorite.findOne({
                where: {
                    user_id: user_id,
                    car_id: car_id,
                },
            });
        } catch (error) {
            console.error('Error in getFavoriteByUserAndCar:', error);
            throw error; // Re-throw or handle appropriately
        }
    }
    
       

    /**
     * Deletes a car favorite record from the database by its ID.
     * @async
     * @param {number} car_id - The ID of the favorite to delete.
     * @returns {Promise<boolean>} - `true` if the favorite was deleted, `false` otherwise.
     */
    async deleteFavorite(favorites_id) {
        const [result] = await this.pool.query('DELETE FROM favorites WHERE favorites_id = ?', [favorites_id]);
        return result.affectedRows > 0;
    }
}

module.exports = new FavoriteService();
