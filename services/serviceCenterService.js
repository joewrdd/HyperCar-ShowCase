const { initDB } = require('../config/database.js');
const ServiceCenter = require('../models/serviceCenterModel.js');

/**
 * Service class for managing service center-related database operations.
 * Handles CRUD operations for the `service_centers` table.
 */
class ServiceCenterService {
    /**
     * Initializes the ServiceCenterService instance and database connection pool.
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
     * Retrieves all service centers from the database.
     * @async
     * @returns {Promise<Array<ServiceCenter>>} - Array of ServiceCenter objects representing all service centers.
     */
    async getAllServiceCenters() {
        const [rows] = await this.pool.query('SELECT * FROM service_centers');
        return rows.map(ServiceCenter.fromRow);
    }

    /**
     * Retrieves a service center by its ID.
     * @async
     * @param {number} id - The ID of the service center to retrieve.
     * @returns {Promise<ServiceCenter|null>} - ServiceCenter object if found,
     *  or null if no service center with the specified ID exists.
     */
    async getServiceCenterById(id) {
        const [rows] = await this.pool.query('SELECT * FROM service_centers WHERE service_cent_id = ?', [id]);
        if (rows.length === 0) return null;
        return ServiceCenter.fromRow(rows[0]);
    }

    /**
     * Creates a new service center in the database.
     * @async
     * @param {Object} data - Data for the new service center, containing `name`, `location`,
     *  `contact_nb`, `manufacturer_id`, and `services_offered`.
     * @param {string} data.name - The name of the service center.
     * @param {string} data.location - The location of the service center.
     * @param {string} data.contact_nb - The contact number of the service center.
     * @param {number} data.manufacturer_id - The manufacturer ID associated with the service center.
     * @param {string} data.services_offered - Services offered by the service center.
     * @returns {Promise<Object>} - Object with `id`, `name`, `location`, `contact_nb`,
     *  `manufacturer_id`, and `services_offered` of the newly created service center.
     */
    async createServiceCenter(data) {
        const { name, location, contact_nb, manufacturer_id, services_offered } = data;
        const [result] = await this.pool.query(
            `INSERT INTO service_centers (name, location, contact_nb, manufacturer_id, 
            services_offered) VALUES (?, ?, ?, ?, ?)`,
            [name, location, contact_nb, manufacturer_id, services_offered]
        );
        return { id: result.insertId, name, location, contact_nb, manufacturer_id, services_offered };
    }

    /**
     * Updates an existing service center's data.
     * @async
     * @param {number} id - The ID of the service center to update.
     * @param {Object} data - New data for the service center, containing `name`, 
     * `location`, `contact_nb`, `manufacturer_id`, and `services_offered`.
     * @param {string} data.name - The new name of the service center.
     * @param {string} data.location - The new location of the service center.
     * @param {string} data.contact_nb - The new contact number of the service center.
     * @param {number} data.manufacturer_id - The new manufacturer ID associated with the service center.
     * @param {string} data.services_offered - The updated services offered by the service center.
     * @returns {Promise<boolean>} - `true` if the service center was updated, `false` otherwise.
     */
    async updateServiceCenter(id, data) {
        const { name, location, contact_nb, manufacturer_id, services_offered } = data;
        const [result] = await this.pool.query(
            `UPDATE service_centers SET name = ?, location = ?, contact_nb = ?, manufacturer_id = ?,
             services_offered = ? WHERE service_cent_id = ?`,
            [name, location, contact_nb, manufacturer_id, services_offered, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Deletes a service center from the database by its ID.
     * @async
     * @param {number} id - The ID of the service center to delete.
     * @returns {Promise<boolean>} - `true` if the service center was deleted, `false` otherwise.
     */
    async deleteServiceCenter(id) {
        const [result] = await this.pool.query('DELETE FROM service_centers WHERE service_cent_id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new ServiceCenterService();
