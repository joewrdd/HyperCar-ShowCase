const { initDB } = require('../config/database.js');
const Manufacturer = require('../models/manufacturerModel.js');

/**
 * Service class for managing manufacturer-related database operations.
 * Handles CRUD operations for the `manufacturers` table.
 */
class ManufacturerService {
    /**
     * Initializes the ManufacturerService instance and database connection pool.
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
     * Retrieves all manufacturers from the database.
     * @async
     * @returns {Promise<Array<Manufacturer>>} - Array of Manufacturer objects representing all manufacturers in the database.
     */
    async getAllManufacturers() {
        const [rows] = await this.pool.query('SELECT * FROM manufacturers');
        return rows.map(Manufacturer.fromRow);
    }

    /**
     * Retrieves a manufacturer by its ID.
     * @async
     * @param {number} id - The ID of the manufacturer to retrieve.
     * @returns {Promise<Manufacturer|null>} - Manufacturer object if found, 
     * or null if no manufacturer with the specified ID exists.
     */
    async getManufacturerById(id) {
        const [rows] = await this.pool.query('SELECT * FROM manufacturers WHERE manufacturer_id = ?', [id]);
        if (rows.length === 0) return null;
        return Manufacturer.fromRow(rows[0]);
    }

    /**
     * Creates a new manufacturer in the database.
     * @async
     * @param {Object} manufacturerData - Data for the new manufacturer, containing `name`, `country`, and `founded_year`.
     * @param {string} manufacturerData.name - The name of the manufacturer.
     * @param {string} manufacturerData.country - The country of origin for the manufacturer.
     * @param {number} manufacturerData.founded_year - The year the manufacturer was founded.
     * @returns {Promise<Object>} - Object with `id`, `name`, `country`, and `founded_year` of the newly created manufacturer.
     */
    async createManufacturer(manufacturerData) {
        const { name, country, founded_year, images } = manufacturerData;
        const [result] = await this.pool.query(
            'INSERT INTO manufacturers (name, country, founded_year, images) VALUES (?, ?, ?, ?)',
            [name, country, founded_year, images]
        );
        return { id: result.insertId, name, country, founded_year, images };
    }

    /**
     * Updates an existing manufacturer's data.
     * @async
     * @param {number} id - The ID of the manufacturer to update.
     * @param {Object} manufacturerData - New data for the manufacturer, containing `name`, `country`, and `founded_year`.
     * @param {string} manufacturerData.name - The updated name of the manufacturer.
     * @param {string} manufacturerData.country - The updated country of the manufacturer.
     * @param {number} manufacturerData.founded_year - The updated year the manufacturer was founded.
     * @returns {Promise<boolean>} - `true` if the manufacturer was updated, `false` otherwise.
     */
    async updateManufacturer(id, manufacturerData) {
        const { name, country, founded_year, images } = manufacturerData;
        const [result] = await this.pool.query(
            'UPDATE manufacturers SET name = ?, country = ?, founded_year = ?, images = ? WHERE manufacturer_id = ?',
            [name, country, founded_year, images, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Deletes a manufacturer from the database by its ID.
     * @async
     * @param {number} id - The ID of the manufacturer to delete.
     * @returns {Promise<boolean>} - `true` if the manufacturer was deleted, `false` otherwise.
     */
    async deleteManufacturer(id) {
        const [result] = await this.pool.query('DELETE FROM manufacturers WHERE manufacturer_id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new ManufacturerService();
