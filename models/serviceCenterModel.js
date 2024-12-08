/**
 * ServiceCenter model representing a service center entity in the system.
 * This model is used to define the structure of a service center record and 
 * handle instantiation and conversion of data from database rows.
 */
class ServiceCenter {
    /**
     * Creates an instance of the ServiceCenter class.
     * @constructor
     * @param {number} service_cent_id - The unique identifier for the service center.
     * @param {string} name - The name of the service center.
     * @param {string} location - The location of the service center.
     * @param {string} contact_nb - The contact number for the service center.
     * @param {number} manufacturer_id - The identifier of the manufacturer associated with the service center.
     * @param {string} services_offered - A description or list of services offered by the service center.
     */
    constructor(service_cent_id, name, location, contact_nb, manufacturer_id, services_offered) {
        this.service_cent_id = service_cent_id;
        this.name = name;
        this.location = location;
        this.contact_nb = contact_nb;
        this.manufacturer_id = manufacturer_id;
        this.services_offered = services_offered;
    }

    /**
     * Converts a database row into a ServiceCenter instance.
     * @static
     * @param {Object} row - The database row representing a service center.
     * @param {number} row.service_cent_id - The unique identifier for the service center.
     * @param {string} row.name - The name of the service center.
     * @param {string} row.location - The location of the service center.
     * @param {string} row.contact_nb - The contact number for the service center.
     * @param {number} row.manufacturer_id - The manufacturer ID associated with the service center.
     * @param {string} row.services_offered - A description of services offered by the service center.
     * @returns {ServiceCenter} A new instance of the ServiceCenter class.
     */
    static fromRow(row) {
        return new ServiceCenter(
            row.service_cent_id,
            row.name,
            row.location,
            row.contact_nb,
            row.manufacturer_id,
            row.services_offered
        );
    }
}

module.exports = ServiceCenter;
