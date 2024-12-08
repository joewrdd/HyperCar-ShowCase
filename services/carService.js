const { initDB } = require('../config/database.js');
const Car = require('../models/carModel.js');

/**
 * Service class for managing car-related database operations.
 * Handles CRUD operations for the `cars` table.
 */
class CarService {
    /**
     * Initializes the CarService instance and database connection pool.
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
     * Retrieves all car records from the database.
     * @async
     * @returns {Promise<Array<Car>>} - An array of Car objects representing all cars in the database.
     */
    async getAllCars() {
        const [rows] = await this.pool.query('SELECT * FROM cars');
        return rows.map(Car.fromRow);
    }

    /**
     * Retrieves a car record by its ID.
     * @async
     * @param {number} id - The ID of the car to retrieve.
     * @returns {Promise<Car|null>} - Car object if found, or null if no car with the specified ID exists.
     */
    async getCarById(id) {
        const [rows] = await this.pool.query('SELECT * FROM cars WHERE car_id = ?', [id]);
        if (rows.length === 0) return null;
        return Car.fromRow(rows[0]);
    }

    /**
     * Creates a new car record in the database.
     * @async
     * @param {Object} carData - Data for the new car, containing `model`, `brand`, `top_speed`, `horsepower`, `price`, and `image`.
     * @param {string} carData.model - The model name of the car.
     * @param {string} carData.brand - The brand of the car.
     * @param {number} carData.top_speed - The top speed of the car.
     * @param {number} carData.horsepower - The horsepower of the car.
     * @param {string} carData.price - The price of the car.
     * @param {string} carData.image - The image filename or URL of the car.
     * @returns {Promise<Object>} - Object with `id`, `model`, `brand`, `top_speed`, `horsepower`, `price`, and `image` of the newly created car.
     */
    async createCar(carData) {
        const { model, brand, top_speed, horsepower, price, images } = carData;
        const [result] = await this.pool.query(
            'INSERT INTO cars (model, brand, top_speed, horsepower, price, images) VALUES (?, ?, ?, ?, ?, ?)',
            [model, brand, top_speed, horsepower, price, images]
        );
        return { id: result.insertId, model, brand, top_speed, horsepower, price, images };
    }

    /**
     * Updates an existing car record in the database.
     * @async
     * @param {number} id - The ID of the car to update.
     * @param {Object} carData - New data for the car, containing `model`, `brand`, `top_speed`, `horsepower`, `price`, and `image`.
     * @param {string} carData.model - The updated model name of the car.
     * @param {string} carData.brand - The updated brand of the car.
     * @param {number} carData.top_speed - The updated top speed of the car.
     * @param {number} carData.horsepower - The updated horsepower of the car.
     * @param {string} carData.price - The updated price of the car.
     * @param {string} carData.images - The updated image filename or URL of the car.
     * @returns {Promise<boolean>} - `true` if the car was updated, `false` otherwise.
     */
    async updateCar(id, carData) {
        const { model, brand, top_speed, horsepower, price, images } = carData;
        const [result] = await this.pool.query(
            'UPDATE cars SET model = ?, brand = ?, top_speed = ?, horsepower = ?, price = ?, images = ? WHERE car_id = ?',
            [model, brand, top_speed, horsepower, price, images, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Deletes a car record from the database by its ID.
     * @async
     * @param {number} id - The ID of the car to delete.
     * @returns {Promise<boolean>} - `true` if the car was deleted, `false` otherwise.
     */
    async deleteCar(id) {
        const [result] = await this.pool.query('DELETE FROM cars WHERE car_id = ?', [id]);
        return result.affectedRows > 0;
    }

    /**
     * Searches for cars by model or brand.
     * @async
     * @param {string} query - The search query string.
     * @returns {Promise<Array<Car>>} - An array of matching Car objects.
     */
    async searchCars(query) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM cars WHERE model LIKE ? OR brand LIKE ?',
                [`%${query}%`, `%${query}%`]
            );
            return rows.map(Car.fromRow);
        } catch (error) {
            throw new Error('Error searching cars');
        }
    }
}

module.exports = new CarService();
