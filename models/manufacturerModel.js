/**
 * Manufacturer model representing a car manufacturer entity in the system.
 * This model is used to define the structure of a manufacturer and 
 * handle instantiation and conversion of data from database rows.
 */
class Manufacturer {
    /**
     * Creates an instance of the Manufacturer class.
     * @constructor
     * @param {number} manufacturer_id - The unique identifier for the manufacturer.
     * @param {string} name - The name of the manufacturer.
     * @param {string} country - The country where the manufacturer is based.
     * @param {number} founded_year - The year the manufacturer was founded.
     */
    constructor(manufacturer_id, name, country, founded_year) {
        this.manufacturer_id = manufacturer_id;
        this.name = name;
        this.country = country;
        this.founded_year = founded_year;
    }

    /**
     * Converts a database row into a Manufacturer instance.
     * @static
     * @param {Object} row - The database row representing a manufacturer.
     * @param {number} row.manufacturer_id - The unique identifier for the manufacturer.
     * @param {string} row.name - The name of the manufacturer.
     * @param {string} row.country - The country where the manufacturer is based.
     * @param {number} row.founded_year - The year the manufacturer was founded.
     * @returns {Manufacturer} A new instance of the Manufacturer class.
     */
    static fromRow(row) {
        return new Manufacturer(
            row.manufacturer_id,
            row.name,
            row.country,
            row.founded_year
        );
    }
}

module.exports = Manufacturer;
