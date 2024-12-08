const { initDB } = require('../config/database');
/**
 * Favorites model representing a user's favorite cars.
 * This model is used to define the structure of a favorite and 
 * handle instantiation and conversion of data from database rows.
 */
class Favorites {
    /**
     * Creates an instance of the Favorites class.
     * @constructor
     * @param {number} favorites_id - The unique identifier for the favorite entry.
     * @param {number} user_id - The ID of the user who marked the car as a favorite.
     * @param {number} car_id - The ID of the car marked as a favorite.
     */
    constructor(favorites_id, user_id, car_id) {
        this.favorites_id = favorites_id;
        this.user_id = user_id;
        this.car_id = car_id;
    }

    /**
     * Converts a database row into a Favorites instance.
     * @static
     * @param {Object} row - The database row representing a user's favorite car.
     * @param {number} row.favorites_id - The unique identifier for the favorite entry.
     * @param {number} row.user_id - The ID of the user who marked the car as a favorite.
     * @param {number} row.car_id - The ID of the car marked as a favorite.
     * @returns {Favorites} A new instance of the Favorites class.
     */
    static fromRow(row) {
        return new Favorites(
            row.favorites_id,
            row.user_id,
            row.car_id
        );
    }

    static async findOne({ user_id, car_id }) {
        const db = await initDB();
        try {
            // Since db.query() returns an array with rows at the first index, you can destructure it directly
            const [rows] = await db.query(
                'SELECT * FROM favorites WHERE user_id = ? AND car_id = ? LIMIT 1',
                [user_id, car_id]
            );
            
            // Check if rows are found and return the first row
            return rows.length ? Favorites.fromRow(rows[0]) : null;
        } catch (error) {
            throw new Error('Error querying favorites: ' + error.message);
        }
    }
    
}

module.exports = Favorites;
